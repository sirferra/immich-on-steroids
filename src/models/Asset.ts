export type AssetType = {
    id: string;
    createdAt: string;
    deviceAssetId: string;
    ownerId: string;
    deviceId: string;
    libraryId: string;
    type: string;
    originalPath: string;
    originalFileName: string;
    originalMimeType: string;
    thumbhash: string;
    fileCreatedAt: string;
    fileModifiedAt: string;
    localDateTime: string;
    updatedAt: string;
    isFavorite: boolean;
    isArchived: boolean;
    isTrashed: boolean;
    visibility: string;
    duration: string;
    livePhotoVideoId: string;
    people: string[];
    checksum: string;
    isOffline: boolean;
    hasMetadata: boolean;
    duplicateId: string;
    resized: boolean;
}
export class Asset implements AssetType {
    id: string;
    createdAt: string;
    deviceAssetId: string;
    ownerId: string;
    deviceId: string;
    libraryId: string;
    type: string;
    originalPath: string;
    originalFileName: string;
    originalMimeType: string;
    thumbhash: string;
    fileCreatedAt: string;
    fileModifiedAt: string;
    localDateTime: string;
    updatedAt: string;
    isFavorite: boolean;
    isArchived: boolean;
    isTrashed: boolean;
    visibility: string;
    duration: string;
    livePhotoVideoId: string;
    people: string[];
    checksum: string;
    isOffline: boolean;
    hasMetadata: boolean;
    duplicateId: string;
    resized: boolean;
    constructor(public data: AssetType) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.deviceAssetId = data.deviceAssetId;
        this.ownerId = data.ownerId;
        this.deviceId = data.deviceId;
        this.libraryId = data.libraryId;
        this.type = data.type;
        this.originalPath = data.originalPath;
        this.originalFileName = data.originalFileName;
        this.originalMimeType = data.originalMimeType;
        this.thumbhash = data.thumbhash;
        this.fileCreatedAt = data.fileCreatedAt;
        this.fileModifiedAt = data.fileModifiedAt;
        this.localDateTime = data.localDateTime;
        this.updatedAt = data.updatedAt;
        this.isFavorite = data.isFavorite;
        this.isArchived = data.isArchived;
        this.isTrashed = data.isTrashed;
        this.visibility = data.visibility;
        this.duration = data.duration;
        this.livePhotoVideoId = data.livePhotoVideoId;
        this.people = data.people;
        this.checksum = data.checksum;
        this.isOffline = data.isOffline;
        this.hasMetadata = data.hasMetadata;
        this.duplicateId = data.duplicateId;
        this.resized = data.resized;
    }

   public getThumb(size: "preview" | "thumbnail" = "preview"): string {
        return `/api/assets/${this.id}/thumbnail?size=${size}`;
    }

    public getSrc(): string {
        if (this.type === "VIDEO") {
        return `/api/assets/${this.id}/video/playback`;
        }
        return `/api/assets/${this.id}/original`;
    }
}
