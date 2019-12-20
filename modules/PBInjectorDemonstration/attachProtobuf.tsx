const globallyScopedProtobuffClients = new Map<any,any>();
const translateBetweenPBandObj = {
  toProp(name: string) {
    if(name.length > 3) return name.slice(3,4).toLowerCase()+name.slice(4);
    return "";
  },
  toGet(name: string) {
    return "get"+name.slice(0,1).toUpperCase()+name.slice(1)
  },
  toSet(name: string) {
    return "set"+name.slice(0,1).toUpperCase()+name.slice(1);
  },
}
function defineThenApply(host: any, property: string, append: string[]) {
  if(!Reflect.has(host,property) ){
    Object.defineProperty(
      host,
      property, {
        value: append,
        configurable: false,
        writable: false,
        enumerable: false,
      }
    );
    return append;
  }
  const existingValue = Reflect.get(host,property);
  existingValue.push(...append);
  return existingValue;
}
export function attachProtobuf(clientPrototype: any, messagenger: any, asProperty: string): any {
  return function(target: any): any {
    if(!globallyScopedProtobuffClients.has(clientPrototype) ){
      globallyScopedProtobuffClients.set(
        clientPrototype, 
        new clientPrototype('https://core-dev.kalosflorida.com:8443')
      );
    }
    const client = globallyScopedProtobuffClients.get(clientPrototype);
    const message = messagenger instanceof Function ?
      new messagenger():
      messagenger;
    const expecting: string[] = defineThenApply(target,`${asProperty}$expect`,[]);
    const supplying: string[] = defineThenApply(target,`${asProperty}$supply`,[]);
    Object.defineProperty(
      target, 
      `${asProperty}`,{
        value: client,
        configurable: false,
        writable: false,
        enumerable: false,
      }
    )
    Object.defineProperty(
      target, 
      `${asProperty}$message`,{
        value: message,
        configurable: false,
        writable: true,
        enumerable: false,
      }
    )
    Object.defineProperty(
      target.prototype,
      `${asProperty}$Get`, {
        value: function(){
          const setter = translateBetweenPBandObj.toSet;
          for(const supplied of supplying) {
            if( Reflect.has(this,supplied) && this[supplied] !== undefined ){
              message[setter(supplied)](this[supplied]);
              console.log()
            }
          }
          if(client) client.Get(message).then(
            Reflect.get(target.prototype,`${asProperty}$After`).bind(this)
          ).then(this.forceUpdate())
        },
        configurable: false,
        writable: false,
        enumerable: false,
      } 
    );
    Object.defineProperty(
      target.prototype,
      `${asProperty}$Send`, {
        value: function(){
          const setter = translateBetweenPBandObj.toSet;
          for(const supplied of supplying) {
            if( Reflect.has(this,supplied) && this[supplied] !== undefined ){
              message[setter(supplied)](this[supplied]);
            }
          }
          console.log(message);
          if(client) client.Update(message).then(
            (got: any)=>{
              console.log(got);
            }
          );
        },
        configurable: false,
        writable: false,
        enumerable: false,
      }
    );
    Object.defineProperty(
      target.prototype,
      `${asProperty}$After`, {
        value: function(received: any){
          const setter = translateBetweenPBandObj.toSet;
          for(const expected of expecting) {
            Reflect.set(this, expected, received[expected] );
            message[setter(expected)]( received[expected] );
          }
        },
        configurable: false,
        writable: false,
        enumerable: false,
      } 
    );
  }
}
export function expects(asProperty: string, ...fields: string[]): any {
  return function( target: any) {
    defineThenApply(target,`${asProperty}$expect`,fields)
  }
}
export function supplies(asProperty: string, ...fields: string[]): any {
  return function( target: any) {
    defineThenApply(target,`${asProperty}$supply`,fields)
  }
}