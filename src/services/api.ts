const baseURL =
    "https://academico.ifms.edu.br/administrativo/professores/diario/"

export async function getDadosPropostaTrabalho(
    idDiario: number,
    idPlanoEnsino: number,
) {
    const response = await fetch(
        `${baseURL}${idDiario}/plano_ensino/json_proposta_trabalho/${idPlanoEnsino}?sEcho=1&iColumns=7&sColumns=%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=-1&mDataProp_0=0&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=1&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=2&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=3&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=4&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=5&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=6&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&sSearch=&bRegex=false&iSortCol_0=0&sSortDir_0=desc&iSortCol_1=1&sSortDir_1=desc&iSortingCols=2&_=1630278718236`,
    )
    const json = await response.json()
    return json
}
export async function getConteudoDiario(idDiario: number) {
    const response = await fetch(`${baseURL}${idDiario}/conteudo`)
    const data = await response.text()
    return data
}
export async function getFormProposta(idDiario: number, idPlanoEnsino: number) {
    const response = await fetch(
        `${baseURL}${idDiario}/plano_ensino/adicionar_proposta_trabalho/${idPlanoEnsino}`,
    )
    const data = await response.text()
    return data
}
export async function gravarProposta(form: HTMLFormElement, idDiario: number) {
    let formData = new FormData(form)
    return fetch(
        `${baseURL}${idDiario}/plano_ensino/salvar_form_proposta_trabalho`,
        {
            method: "POST",
            body: formData,
        },
    )
}
