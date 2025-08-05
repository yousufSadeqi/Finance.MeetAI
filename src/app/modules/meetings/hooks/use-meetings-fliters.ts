'use client'

import { DEFAULT_PAGE } from '@/constants'
import {useQueryStates, parseAsInteger, parseAsString, parseAsStringEnum} from 'nuqs'
import {MeetingsStatus} from '../types'



export const UseMeetingsFilters = () => {
    return useQueryStates({
      search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
      page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
      status: parseAsStringEnum(Object.values(MeetingsStatus)),
      agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    });
  };
  