export const standardsUtilizedItems = {
    "_802_11a": [{ value: "_5GHz", displayValue: "5GHz" }],
    "_802_11b": [{ value: "_2_4GHz", displayValue: "2.4GHz" }],
    "_802_11g": [{ value: "_2_4GHz", displayValue: "2.4GHz" }],
    "_802_11n": [{ value: "_2_4GHz", displayValue: "2.4GHz" }, { value: "_5GHz", displayValue: "5GHz" }],
    "_802_11ac": [{ value: "_5GHz", displayValue: "5GHz" }],
    "_802_11ax": [{ value: "_2_4GHz", displayValue: "2.4GHz" }, { value: "_5GHz", displayValue: "5GHz" }, { value: "_6GHz", displayValue: "6GHz" }],

}

const OPEN = { value: "Open", displayValue: "Open" };
const WEP = { value: "WEP", displayValue: "WEP" };
const WPA = { value: "WPA", displayValue: "WPA" };
const WPA2 = { value: "WPA2", displayValue: "WPA2" };
const WPA3 = { value: "WPA3", displayValue: "WPA3" };

export const encryptionItems = {
    "_802_11a": { "_5GHz" : [ OPEN , WEP, WPA, WPA2] },
    "_802_11b": { "_2_4GHz" : [ OPEN , WEP, WPA, WPA2] },
    "_802_11g": { "_2_4GHz" : [ OPEN , WEP, WPA, WPA2] },
    "_802_11n": { "_2_4GHz" : [ OPEN , WPA2, WPA3] , "_5GHz" : [ OPEN , WPA2, WPA3] },
    "_802_11ac": { "_5GHz" : [ OPEN , WPA2, WPA3] },
    "_802_11ax": { "_2_4GHz" : [ OPEN , WPA3] , "_5GHz" : [ OPEN , WPA3] ,  "_6GHz" : [ OPEN , WPA3] },
}




