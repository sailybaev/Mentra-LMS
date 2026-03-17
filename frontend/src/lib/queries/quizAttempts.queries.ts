import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as quizAttemptsApi from '@/lib/api/quizAttempts';
import { QuizAnswerInput } from '@/types/quiz_attempt';

export const quizAttemptKeys = {
  all: ['quiz-attempts'] as const,
  myAttempt: (quizID: string) => [...quizAttemptKeys.all, 'my-attempt', quizID] as const,
};

export function useMyQuizAttempt(quizID: string) {
  return useQuery({
    queryKey: quizAttemptKeys.myAttempt(quizID),
    queryFn: () => quizAttemptsApi.getMyQuizAttempt(quizID),
    enabled: !!quizID,
    retry: false,
  });
}

export function useSubmitQuizAttempt(quizID: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (answers: QuizAnswerInput[]) => quizAttemptsApi.submitQuizAttempt(quizID, answers),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: quizAttemptKeys.myAttempt(quizID) });
    },
  });
}
