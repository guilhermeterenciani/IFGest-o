export enum TipoHorario {
    NONE = "NONE",
    PAT = "PAT",
    PE = "PE",
    P = "P"
}
export enum StatusHorario {
    OCUPADO = "OCUPADO",
    LIVRE = "LIVRE",
    PREVIA = "PREVIA"
}
export type THorario = {
    dataRowId: number
    dataColId: number
    diaDaSemana: number
    periodo: {
        horaInicio: string
        horaFim: string
    }
    tipo?: TipoHorario
    status: StatusHorario
    element: HTMLTableCellElement
}
