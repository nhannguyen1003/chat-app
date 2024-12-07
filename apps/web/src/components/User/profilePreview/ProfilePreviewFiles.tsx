import Typography from '@/Atoms/Typography/Typography';
import { RootState } from '@/global/store';
import useCurrentChat from '@/hooks/useCurrentChat';
import { fetcher } from '@/utils/fetcher';
import Image from 'next/image';
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import OptionIcon from '../Sidebar/OptionIcon';

const ProfilePreviewFiles = () => {
  const { chat } = useCurrentChat();

  const { receiver_id } = useSelector((state: RootState) => state.ChatSlice);
  const { Me } = useSelector((state: RootState) => state.UserSlice);

  const filesMessages = chat?.messages?.filter((message) => message.messageType !== 'text');

  return (
    <div className="bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg flex flex-col gap-2 py-4">
      <div className="flex place-items-center justify-between px-10">
        <Typography className="opacity-50">Media, links and docs</Typography>
        <div className="flex place-items-center justify-center">
          <Typography className="opacity-50">{filesMessages?.length} </Typography>
          <OptionIcon src={'/icons/down.svg'} className="-rotate-90" />
        </div>
      </div>

      <div className="flex place-items-center justify-center gap-2">
        <Suspense fallback={filesMessages?.length === 0 ? '' : <ProfilePreviewFilesFallback />}>
          {filesMessages
            ?.filter((file) => file.messageType === 'video' || file.messageType === 'image' || file.messageType === 'svg')
            .slice(0, 3)
            .map(async (mediaFile) => {
              const user_id = mediaFile?.from.user_id === Me?.user_id ? Me.user_id : receiver_id;
              const ext = mediaFile?.messageType === 'video' ? '.png' : mediaFile?.media?.ext;
              const pathUrl = mediaFile?.media?.mime.startsWith('image/svg')
                ? `api/file/get-attachment/${user_id}/${mediaFile?.media?.id}`
                : `api/file/get-attachment-thumbnail/${user_id}/${mediaFile?.media?.id}/sm`;
              const thumbnailBlob = await fetcher(pathUrl, undefined, 'blob', 'static', { ext });
              const url = URL.createObjectURL(thumbnailBlob);
              return <FilePreviewMediaPreview url={url} key={mediaFile?.media?.id} />;
            })}
        </Suspense>
      </div>
    </div>
  );
};

export default ProfilePreviewFiles;

const FilePreviewMediaPreview = ({ url }: { url: string | undefined }) => {
  return url ? (
    <span className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg relative max-h-[90px] min-h-[90px] min-w-[90px] rounded-md border-[8px]">
      <Image src={url} alt="media" fill objectFit="cover" />
    </span>
  ) : null;
};

const ProfilePreviewFilesFallback = () => {
  return Array.from({ length: 3 }).map((item, index) => (
    <span
      key={index}
      className="border-whatsapp-light-secondary_bg dark:border-whatsapp-dark-secondary_bg flex h-[90px] w-[90px] place-items-center justify-center rounded-md border-[8px]  "
    >
      <Image src={'/icons/spinner.svg'} height={50} width={50} alt={'loading'} className="opacity-50" />
    </span>
  ));
};
