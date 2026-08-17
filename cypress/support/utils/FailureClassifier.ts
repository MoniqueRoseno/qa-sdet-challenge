export type FailureType =
  | "CONFIGURATION"
  | "RATE_LIMIT"
  | "ENVIRONMENT"
  | "FUNCTIONAL";

export interface FailureClassification {
  type: FailureType;
  message: string;
}

export class FailureClassifier {
  static classify(status: number): FailureClassification {
    if (status === 401 || status === 403) {
      return {
        type: "CONFIGURATION",
        message:
          "Falha de autenticação/configuração da dependência externa.",
      };
    }

    if (status === 429) {
      return {
        type: "RATE_LIMIT",
        message:
          "Limite de requisições da dependência externa atingido.",
      };
    }

    if (status >= 500) {
      return {
        type: "ENVIRONMENT",
        message:
          "Dependência externa indisponível ou instável.",
      };
    }

    return {
      type: "FUNCTIONAL",
      message:
        "Resposta recebida não caracteriza indisponibilidade de ambiente.",
    };
  }
}