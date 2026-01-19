import { useHttp } from '@workspace/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  debounceTime,
  exhaustMap,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { getUrl } from 'src/config/api';

type ProblemSetType = {
  id: string;
  title: string;
  description?: string;
  userId: string;
  totalProblems: number;
  attemptedProblems: number;
  createAt: string;
  updateAt: string;
};

type LoadSetParam = {
  onSuccess?: (problemSets: ProblemSetType[]) => void;
};
type CreateSetParam = {
  title: string;
  onSuccess?: (problemSet?: ProblemSetType) => void;
};

type GetSetResp = {
  message: string;
  problemSets: ProblemSetType[];
};
type CreateSetResp = {
  message: string;
  problemSet: ProblemSetType;
};

const useProblemSet = () => {
  // base
  const http = useHttp();
  // state
  const [initLoading, setInitLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [problemSets, setProblemSets] = useState<ProblemSetType[]>([]);

  // subject
  const loadSet$Ref = useRef(new Subject<LoadSetParam>());
  const createSet$Ref = useRef(new Subject<CreateSetParam>());

  // observer
  const loadSetObserver = useCallback(
    (param: LoadSetParam) => {
      return http.get<GetSetResp>(getUrl('/api/Problem/get-set'));
    },
    [http],
  );
  const createSetObserver = useCallback(
    (param: CreateSetParam) => {
      const payload = {
        title: param.title,
      };
      return http.post<CreateSetResp>(
        getUrl('/api/Problem/new-problem-set'),
        payload,
      );
    },
    [http],
  );

  // effect
  useEffect(() => {
    const destroy$ = new Subject<void>();

    loadSet$Ref.current
      .pipe(
        takeUntil(destroy$),
        debounceTime(200),
        tap(() => setInitLoading(true)),
        switchMap((params) =>
          loadSetObserver(params).pipe(
            tap({
              next(value) {
                setInitLoading(false);
                if (value.problemSets) {
                  setProblemSets(value.problemSets);
                }
              },
              error(err) {},
            }),
          ),
        ),
      )
      .subscribe({
        error(err) {},
      });
    createSet$Ref.current
      .pipe(
        takeUntil(destroy$),
        debounceTime(200),
        tap(() => setCreateLoading(true)),
        exhaustMap((params) =>
          createSetObserver(params).pipe(
            tap({
              next(value) {
                if (value.problemSet) {
                  params.onSuccess?.(value.problemSet);
                }
              },
              error(err) {},
            }),
          ),
        ),
      )
      .subscribe({
        error(err) {},
      });

    return () => {
      destroy$.next();
      destroy$.complete();
    };
  }, [http]);

  // funcs
  const loadProblemSets = (
    onSuccess?: (problemSets: ProblemSetType[]) => void,
  ) => {
    loadSet$Ref.current.next({ onSuccess });
  };
  const createProblemSet = (param: CreateSetParam) => {
    createSet$Ref.current.next(param);
  };

  return {
    problemSets,
    initLoading,
    loadProblemSets,
    createLoading,
    createProblemSet,
  };
};

export { useProblemSet };
