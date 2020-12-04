import React, { FC, useCallback, useState, useEffect } from 'react';
import { SectionBar } from '../SectionBar';
import { InfoTable } from '../InfoTable';
import { Confirm } from '../Confirm';
import { ConfirmDelete } from '../ConfirmDelete';
import { Button } from '../Button';
import {
  FileType,
  loadFiles,
  makeFakeRows,
  formatDateTime,
  deleteFileById,
  getFileS3BucketUrl,
  deleteFileFromS3Buckets,
  padWithZeroes,
} from '../../../helpers';
import './styles.less';

interface Props {
  loggedUserId: number;
  title: string;
  bucket: string;
  onClose: () => void;
  onAdd: ({ file, url }: { file: FileType; url: string }) => void;
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
  const [files, setFiles] = useState<FileType[]>([]);
  const [adding, setAdding] = useState<FileType>();
  const [deleting, setDeleting] = useState<FileType>();
  const [confirming, setConfirming] = useState<boolean>(false);
  const [images, setImages] = useState<{
    [key: string]: string;
  }>({});
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList } = await loadFiles({
      bucket,
      ownerId: loggedUserId,
    });
    setFiles(resultsList);
    let images = await Promise.all(
      resultsList.map(async ({ name, bucket }) => ({
        name,
        url: await getFileS3BucketUrl(name, bucket),
      })),
    );
    if (inputFile != null) {
      images.push({ name: inputFile?.filename, url: inputFile?.fileurl });
    }
    setImages(
      images.reduce((aggr, { name, url }) => ({ ...aggr, [name]: url }), {}),
    );
    setLoading(false);
  }, [setLoading, loggedUserId, bucket, setFiles]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleSetAdding = useCallback(
    (adding?: FileType) => () => setAdding(adding),
    [setAdding],
  );

  const handleSetConfirming = useCallback(
    (confirming: boolean) => () => setConfirming(confirming),
    [setConfirming],
  );

  const handleSetDeleting = useCallback(
    (deleting?: FileType) => () => setDeleting(deleting),
    [setDeleting],
  );
  const deleteFile = useCallback(async () => {
    if (!deleting) return;
    const { name, bucket, id } = deleting;
    setDeleting(undefined);
    setLoading(true);
    await deleteFileFromS3Buckets(name, bucket);
    await deleteFileById(deleting.id);
    setLoaded(false);
  }, [deleting, setLoading, setLoaded, setDeleting]);

  const handleConfirm = useCallback(async () => {
    const confirmed = true; // just here so it doesn't yell at me
    onConfirmAdd!({ confirmed });
    setConfirming(false);
  }, [
    adding,
    onAdd,
    removeFileOnAdd,
    setLoading,
    setLoaded,
    images,
    setAdding,
    confirming,
    setConfirming,
  ]);

  const handleAdd = useCallback(async () => {
    if (!adding) return;
    onAdd({
      file: adding,
      url: images[adding.name],
    });
    setAdding(undefined);
    if (removeFileOnAdd) {
      setLoading(true);
      await deleteFileById(adding.id);
      setLoaded(false);
    }
  }, [
    adding,
    onAdd,
    removeFileOnAdd,
    setLoading,
    setLoaded,
    images,
    setAdding,
    confirming,
    setConfirming,
  ]);

  const handleCancelConfirm = useCallback(() => {
    if (onConfirmAdd == undefined) {
      return false;
    }
    const confirmed = false;
    onConfirmAdd({ confirmed });
    return false;
  }, [
    adding,
    onAdd,
    removeFileOnAdd,
    setLoading,
    setLoaded,
    images,
    setAdding,
    confirming,
    setConfirming,
    onConfirmAdd,
  ]);
  const fileArr = [inputFile]; // workaround to allow me to "map" over the file just like
  // there was multiple files - it works, but not the
  // cleanest thing to do

  if (onlyDisplayInputFile) {
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
            Are you sure you want to add the image{' '}
            <strong>{inputFile?.filename}</strong>?
            <br />
            <br />
            <div
              className="FileGalleryImg"
              style={{ backgroundImage: `url(${inputFile?.fileurl})` }}
            />
          </Confirm>
        }
        )
        {deleting && (
          <ConfirmDelete
            open
            onClose={handleSetDeleting()}
            kind="Receipt"
            name={getFileName(deleting.name)}
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
                  let { name, createTime } = file;
                  const fileName = getFileName(name);
                  return [
                    {
                      value: (
                        <img
                          src={`${images[name]}`}
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
                      value: formatDateTime(createTime),
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
            <strong>{getFileName(adding.name)}</strong>?
            <br />
            <br />
            <div
              className="FileGalleryImg"
              style={{ backgroundImage: `url(${images[adding.name]})` }}
            />
          </Confirm>
        )}
        {deleting && (
          <ConfirmDelete
            open
            onClose={handleSetDeleting()}
            kind="Receipt"
            name={getFileName(deleting.name)}
            onConfirm={deleteFile}
          />
        )}
      </div>
    );
  }
};
