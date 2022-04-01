import React, { FC, useCallback, useState, useEffect } from 'react';
import { SectionBar } from '../SectionBar';
import { InfoTable } from '../InfoTable';
import { Confirm } from '../Confirm';
import { ConfirmDelete } from '../ConfirmDelete';
import { Button } from '../Button';
import {
  FileClientService,
  makeFakeRows,
  formatDateTime,
  S3ClientService,
  getMimeType,
} from '../../../helpers';
import './FileGallery.module.less';
import { File } from '../../../@kalos-core/kalos-rpc/File';

interface Props {
  loggedUserId: number;
  title: string;
  bucket: string;
  onClose: () => void;
  onAdd: ({ file, url }: { file: File; url: string }) => void;
  removeFileOnAdd: boolean;
  inputFile?: { filename: string; fileurl: string } | null;
  onlyDisplayInputFile?: boolean;
  onConfirmAdd?: ({ confirmed }: { confirmed: boolean }) => void;
}

const getFileName = (fileName: string) => {
  const [_, ...nameReversed] = fileName.split('').reverse().join('').split('.');
  const [__, ...name] = nameReversed.join('.').split('-');
  return name.join('-').split('').reverse().join('');
};

const PreviewImageSize = [200, 200]; // size of img in px

export const FileGallery: FC<Props> = ({
  loggedUserId,
  title,
  bucket,
  onClose,
  onAdd,
  removeFileOnAdd,
  inputFile,
  onlyDisplayInputFile,
  onConfirmAdd,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [adding, setAdding] = useState<File>();
  const [deleting, setDeleting] = useState<File>();
  const [confirming, setConfirming] = useState<boolean>(false);
  const [images, setImages] = useState<{
    [key: string]: string;
  }>({});
  const load = useCallback(async () => {
    setLoading(true);
    const fileReq = new File();
    fileReq.setBucket(bucket);
    fileReq.setOwnerId(loggedUserId);
    const resultsList = await FileClientService.loadFiles(fileReq);
    setFiles(resultsList.getResultsList());
    let images = await Promise.all(
      resultsList.getResultsList().map(async file => ({
        name: file.getName(),
        url: await S3ClientService.getFileS3BucketUrl(
          file.getName(),
          file.getBucket(),
        ),
      })),
    );
    if (inputFile != null) {
      images.push({ name: inputFile?.filename, url: inputFile?.fileurl });
    }
    setImages(
      images.reduce((aggr, { name, url }) => ({ ...aggr, [name]: url }), {}),
    );
    setLoading(false);
  }, [setLoading, loggedUserId, bucket, setFiles, inputFile]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleSetAdding = useCallback(
    (adding?: File) => () => setAdding(adding),
    [setAdding],
  );

  const handleSetConfirming = useCallback(
    (confirming: boolean) => () => setConfirming(confirming),
    [setConfirming],
  );

  const handleSetDeleting = useCallback(
    (deleting?: File) => () => setDeleting(deleting),
    [setDeleting],
  );
  const deleteFile = useCallback(async () => {
    if (!deleting) return;
    setDeleting(undefined);
    setLoading(true);
    await S3ClientService.deleteFileFromS3Buckets(
      deleting.getName(),
      deleting.getBucket(),
    );
    await FileClientService.deleteFileById(deleting.getId());
    setLoaded(false);
  }, [deleting, setLoading, setLoaded, setDeleting]);

  const handleConfirm = useCallback(async () => {
    const confirmed = true; // just here so it doesn't yell at me
    onConfirmAdd!({ confirmed });
    setConfirming(false);
  }, [setConfirming, onConfirmAdd]);

  const handleAdd = useCallback(async () => {
    if (!adding) return;
    onAdd({
      file: adding,
      url: images[adding.getName()],
    });
    setAdding(undefined);
    if (removeFileOnAdd) {
      setLoading(true);
      await FileClientService.deleteFileById(adding.getId());
      setLoaded(false);
    }
  }, [adding, images, onAdd, removeFileOnAdd]);

  const handleCancelConfirm = useCallback(() => {
    if (onConfirmAdd == undefined) {
      return false;
    }
    const confirmed = false;
    onConfirmAdd({ confirmed });
    return false;
  }, [onConfirmAdd]);
  const fileArr = [inputFile]; // workaround to allow me to "map" over the file just like
  // there was multiple files - it works, but not the
  // cleanest thing to do

  if (onlyDisplayInputFile) {
    const mimeType = getMimeType(inputFile!.filename);
    return (
      <div>
        <SectionBar
          title={title}
          actions={[{ label: 'Close', onClick: handleCancelConfirm }]}
          fixedActions
        />
        {
          <Confirm
            open
            onClose={handleCancelConfirm}
            title="Confirm adding"
            onConfirm={handleConfirm}
          >
            Are you sure you want to add file{' '}
            <strong>{inputFile?.filename}</strong>?
            <br />
            <br />
            {mimeType === 'application/pdf' && (
              <iframe
                src={inputFile?.fileurl}
                className="FileGalleryPdf"
              ></iframe>
            )}
            {mimeType !== 'application/pdf' && (
              <div
                className="FileGalleryImg"
                style={{ backgroundImage: `url(${inputFile?.fileurl})` }}
              />
            )}
          </Confirm>
        }
        {deleting && (
          <ConfirmDelete
            open
            onClose={handleSetDeleting()}
            kind="Receipt"
            name={getFileName(deleting.getName())}
            onConfirm={deleteFile}
          />
        )}
      </div>
    );
  } else {
    return (
      <div>
        <SectionBar
          title={title}
          actions={[{ label: 'Close', onClick: onClose }]}
          fixedActions
        />
        <InfoTable
          columns={[
            { name: 'Photo' },
            { name: 'Name' },
            { name: 'Uploaded at' },
          ]}
          data={
            loading
              ? makeFakeRows()
              : files.map(file => {
                  const fileName = getFileName(file.getName());
                  return [
                    {
                      value: (
                        <img
                          src={`${images[file.getName()]}`}
                          className="FileGalleryImg"
                          id="SingleUploadImgPreview"
                          style={{
                            width: PreviewImageSize[0],
                            height: PreviewImageSize[1],
                          }}
                        />
                      ),
                      onClick: handleSetAdding(file),
                    },
                    {
                      value: fileName,
                      onClick: handleSetAdding(file),
                    },
                    {
                      value: formatDateTime(file.getCreateTime()),
                      onClick: handleSetAdding(file),
                      actions: [
                        <Button
                          key="add"
                          label="Add"
                          onClick={handleSetAdding(file)}
                        />,
                        <Button
                          key="delete"
                          label="Delete"
                          onClick={handleSetDeleting(file)}
                        />,
                      ],
                    },
                  ];
                })
          }
          loading={loading}
        />
        {adding && (
          <Confirm
            open
            onClose={handleSetAdding()}
            title="Confirm adding"
            onConfirm={handleAdd}
          >
            Are you sure you want to add the receipt{' '}
            <strong>{getFileName(adding.getName())}</strong>?
            <br />
            <br />
            <div
              className="FileGalleryImg"
              style={{ backgroundImage: `url(${images[adding.getName()]})` }}
            />
          </Confirm>
        )}
        {deleting && (
          <ConfirmDelete
            open
            onClose={handleSetDeleting()}
            kind="Receipt"
            name={getFileName(deleting.getName())}
            onConfirm={deleteFile}
          />
        )}
      </div>
    );
  }
};
