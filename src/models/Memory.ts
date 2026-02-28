/*
"id": "467a5821-0e11-469a-be51-a5972cf0b21b",
    "createdAt": "2026-02-12T03:00:00.144Z",
    "updatedAt": "2026-02-12T03:00:00.144Z",
    "memoryAt": "2017-02-15T00:00:00.000Z",
    "showAt": "2026-02-15T00:00:00.000Z",
    "hideAt": "2026-02-15T23:59:59.999Z",
    "ownerId": "eae99d78-0fdc-432c-8e5b-0a5261b4e500",
    "type": "on_this_day",
    "data": {
      "year": 2017
    },
    "isSaved": false,
    "assets"
*/
import { AssetType } from "@/models/Asset";

export interface MemoryType {
    id: string;
    createdAt: string;
    updatedAt: string;
    memoryAt: string;
    showAt: string;
    hideAt: string;
    ownerId: string;
    type: string;
    data: {
        year: number;
    };
    isSaved: boolean;
    assets: AssetType[];
}

export class Memory implements MemoryType {
    id: string;
    createdAt: string;
    updatedAt: string;
    memoryAt: string;
    showAt: string;
    hideAt: string;
    ownerId: string;
    type: string;
    data: {
        year: number;
    };
    isSaved: boolean;
    assets: AssetType[];
    constructor(public _data: MemoryType) {
        this.id = _data.id;
        this.createdAt = _data.createdAt;
        this.updatedAt = _data.updatedAt;
        this.memoryAt = _data.memoryAt;
        this.showAt = _data.showAt;
        this.hideAt = _data.hideAt;
        this.ownerId = _data.ownerId;
        this.type = _data.type;
        this.data = _data.data;
        this.isSaved = _data.isSaved;
        this.assets = _data.assets;
    }
}