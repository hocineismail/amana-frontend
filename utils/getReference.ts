export function getReference (lastRef: string):number {
    // let splitRef = lastRef.split("-");
    let getNumero = lastRef.split("/");
    return Number(getNumero[0])
}