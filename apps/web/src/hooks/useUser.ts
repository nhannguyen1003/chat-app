'use client';
import { fetcher } from '@/utils/fetcher';
import { UserEntity } from '@server/modules/user/entities/user.entity';
import useSwr from 'swr';
import { useDispatch } from 'react-redux';
import { setUser } from '@/global/features/UserSlice';
import { AxiosError } from 'axios';

const useUser = () => {
  const dispatch = useDispatch();
  const userFetcher = async () => {
    const Me = await fetcher<UserEntity>('user/me');

    return { Me };
  };

  const result = useSwr<{ Me: UserEntity }, AxiosError>('api/me', userFetcher);
  dispatch(setUser(result.data));
  return result;
};

export default useUser;
