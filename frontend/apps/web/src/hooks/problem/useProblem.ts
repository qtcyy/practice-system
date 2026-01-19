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

// Types
type ProblemType = 0 | 1 | 2 | 3;
type ResultType = 0 | 1;

type ProblemDto = {
  id: string;
  content: string;
  type: ProblemType;
  setId: string;
  order: number;
  status?: number;
  createAt: string;
  updateAt: string;
};

type ProblemResultDto = {
  id: string;
  problemId: string;
  resultType: ResultType;
  content: string;
  order: number;
  isAnswer: boolean;
  createAt: string;
  updateAt: string;
};

type ProblemDetailDto = {
  id: string;
  content: string;
  type: ProblemType;
  setId: string;
  order: number;
  results: ProblemResultDto[];
  userAnswer?: any;
  selectedResultId?: string[];
  createAt: string;
  updateAt: string;
};

type ProblemResultInput = {
  resultType: ResultType;
  content: string;
  order: number;
  isAnswer: boolean;
};

type ProblemInput = {
  content: string;
  type: ProblemType;
  setId: string;
  order: number;
};

type LoadProblemsParam = {
  setId: string;
  onSuccess?: (problems: ProblemDto[]) => void;
};

type LoadProblemDetailParam = {
  problemId: string;
  onSuccess?: (detail: ProblemDetailDto) => void;
};

type AddProblemParam = {
  problemSetId: string;
  problem: ProblemInput;
  results: ProblemResultInput[];
  onSuccess?: (problem: any, results: any[]) => void;
};

type GetProblemsResp = {
  message: string;
  problems: ProblemDto[];
};

type GetProblemDetailResp = {
  message: string;
  problemDetail: ProblemDetailDto;
};

type AddProblemResp = {
  message: string;
  problem: any;
  results: any[];
};

const useProblem = () => {
  // base
  const http = useHttp();

  // state
  const [initLoading, setInitLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [problems, setProblems] = useState<ProblemDto[]>([]);
  const [problemDetail, setProblemDetail] = useState<ProblemDetailDto | null>(
    null,
  );

  // subject
  const loadProblems$Ref = useRef(new Subject<LoadProblemsParam>());
  const loadProblemDetail$Ref = useRef(new Subject<LoadProblemDetailParam>());
  const addProblem$Ref = useRef(new Subject<AddProblemParam>());

  // observer
  const loadProblemsObserver = useCallback(
    (param: LoadProblemsParam) => {
      return http.get<GetProblemsResp>(
        getUrl(`/api/Problem/get-problems/${param.setId}`),
      );
    },
    [http],
  );

  const loadProblemDetailObserver = useCallback(
    (param: LoadProblemDetailParam) => {
      return http.get<GetProblemDetailResp>(
        getUrl(`/api/Problem/get-detail/${param.problemId}`),
      );
    },
    [http],
  );

  const addProblemObserver = useCallback(
    (param: AddProblemParam) => {
      const payload = {
        problemSetId: param.problemSetId,
        problem: param.problem,
        results: param.results,
      };
      return http.post<AddProblemResp>(
        getUrl('/api/Problem/add-problem'),
        payload,
      );
    },
    [http],
  );

  // effect
  useEffect(() => {
    const destroy$ = new Subject<void>();

    // Load problems list
    loadProblems$Ref.current
      .pipe(
        takeUntil(destroy$),
        tap(() => setInitLoading(true)),
        debounceTime(200),
        switchMap((params) =>
          loadProblemsObserver(params).pipe(
            tap({
              next(value) {
                setInitLoading(false);
                if (value.problems) {
                  setProblems(value.problems);
                  params.onSuccess?.(value.problems);
                }
              },
              error(err) {
                setInitLoading(false);
              },
            }),
          ),
        ),
      )
      .subscribe({
        error(err) {},
      });

    // Load problem detail
    loadProblemDetail$Ref.current
      .pipe(
        takeUntil(destroy$),
        tap(() => setDetailLoading(true)),
        debounceTime(200),
        switchMap((params) =>
          loadProblemDetailObserver(params).pipe(
            tap({
              next(value) {
                setDetailLoading(false);
                if (value.problemDetail) {
                  setProblemDetail(value.problemDetail);
                  params.onSuccess?.(value.problemDetail);
                }
              },
              error(err) {
                setDetailLoading(false);
              },
            }),
          ),
        ),
      )
      .subscribe({
        error(err) {},
      });

    // Add problem
    addProblem$Ref.current
      .pipe(
        takeUntil(destroy$),
        tap(() => setAddLoading(true)),
        debounceTime(200),
        exhaustMap((params) =>
          addProblemObserver(params).pipe(
            tap({
              next(value) {
                setAddLoading(false);
                if (value.problem && value.results) {
                  params.onSuccess?.(value.problem, value.results);
                }
              },
              error(err) {
                setAddLoading(false);
              },
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
  }, [
    http,
    loadProblemsObserver,
    loadProblemDetailObserver,
    addProblemObserver,
  ]);

  // funcs
  const loadProblems = (
    setId: string,
    onSuccess?: (problems: ProblemDto[]) => void,
  ) => {
    loadProblems$Ref.current.next({ setId, onSuccess });
  };

  const loadProblemDetail = (
    problemId: string,
    onSuccess?: (detail: ProblemDetailDto) => void,
  ) => {
    loadProblemDetail$Ref.current.next({ problemId, onSuccess });
  };

  const addProblem = (param: AddProblemParam) => {
    addProblem$Ref.current.next(param);
  };

  return {
    problems,
    problemDetail,
    initLoading,
    detailLoading,
    addLoading,
    loadProblems,
    loadProblemDetail,
    addProblem,
  };
};

export { useProblem };
