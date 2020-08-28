import React, { FC, useCallback, useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { SectionBar } from '../SectionBar';
import { InfoTable } from '../InfoTable';
import { Confirm } from '../Confirm';
import {
  FileType,
  loadFiles,
  makeFakeRows,
  formatDateTime,
  deleteFileById,
  getFileS3BucketUrl,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';
import './styles.less';

interface Props {
  loggedUserId: number;
  title: string;
  bucket: string;
  onClose: () => void;
  onAdd: (file: FileType) => void;
  removeFileOnAdd: boolean;
}

const getFileName = (fileName: string) => {
  const [_, ...nameReversed] = fileName.split('').reverse().join('').split('.');
  const [__, ...name] = nameReversed.join('').split('-');
  return name.join('').split('').reverse().join('');
};

export const FileGallery: FC<Props> = ({
  loggedUserId,
  title,
  bucket,
  onClose,
  onAdd,
  removeFileOnAdd,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [adding, setAdding] = useState<FileType>();
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
    const images = await Promise.all(
      resultsList.map(async ({ name, bucket }) => ({
        name,
        url: await getFileS3BucketUrl(name, bucket),
      })),
    );
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
    [setAdding, adding],
  );
  const handleAdd = useCallback(async () => {
    if (!adding) return;
    onAdd(adding);
    setAdding(undefined);
    if (removeFileOnAdd) {
      setLoading(true);
      await deleteFileById(adding.id);
      setLoaded(false);
    }
  }, [adding, onAdd, removeFileOnAdd, setLoading, setLoaded]);
  return (
    <div>
      <SectionBar
        title={title}
        actions={[{ label: 'Close', onClick: onClose }]}
        fixedActions
      />
      <InfoTable
        columns={[{ name: 'Photo' }, { name: 'Name' }, { name: 'Uploaded at' }]}
        data={
          loading
            ? makeFakeRows()
            : files.map(file => {
                const { name, createTime } = file;
                const fileName = getFileName(name);
                return [
                  {
                    value: (
                      <div
                        className="FileGalleryImg"
                        style={{ backgroundImage: `url(${images[name]})` }}
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
                      <IconButton
                        key="add"
                        size="small"
                        onClick={handleSetAdding(file)}
                      >
                        <AddCircleIcon />
                      </IconButton>,
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
          Are you sure, you want to add file{' '}
          <strong>{getFileName(adding.name)}</strong>?
        </Confirm>
      )}
    </div>
  );
};
