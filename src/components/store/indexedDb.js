indexedDB = indexedDB || webkitIndexedDB || mozIndexedDB || null;
if(!indexedDB){
    return false
}