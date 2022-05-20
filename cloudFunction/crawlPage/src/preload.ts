import { getAdaptor } from "./adaptor";
import { convertBody } from "./parser/getNotionContent";

console.log("Preload js executed")

window.adaptor = getAdaptor(window.location.href)!;
window.convertBody = convertBody;