import { Asset, type AssetType } from "@/models/Asset";
import { MemoryType } from "@/models/Memory";
import ClickeableImage from "./ClickableImage";

type MemoriesProps = {
  memories: MemoryType[];
};

export default function Memories({ memories = [] }: MemoriesProps) {
  const parsePassTime = (year: number) => {
      const elapsed = new Date().getFullYear() - year;
      return `Hace ${elapsed > 1 ? `${elapsed} años` : `${elapsed} año`}`;
  }

  const groupByYear = (memories: MemoryType[]): MemoryType[] => {
    const grouped: MemoryType[] = [];

    memories.forEach((memory) => {
      const year = memory.data.year;
      const existingMemory = grouped.find((m) => m.data.year === year);
      if (existingMemory) {
        existingMemory.assets.push(...memory.assets);
      } else {
        grouped.push(memory);
      }
    })
    return grouped;
  }

  if (memories.length === 0) {
    return (
      <p className="text-sm opacity-80">
        No hay memories para mostrar.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {groupByYear(memories).map((memory) => {
        const asset = new Asset(memory.assets[0] as AssetType);
        return (
          <div key={memory.id} className="flex flex-col items-center">
            <ClickeableImage 
              key={asset.id}
              src={asset.getThumb("thumbnail")}
              alt={asset.originalFileName || `Asset ${asset.id}`}
              width={220}
              height={220}
              className="h-40 w-full object-cover"
              eventType="renderAssets"
              payload={memory.assets}
            />
            <p className="text-sm mt-1 text-center">{parsePassTime(memory.data.year)} ({memory.data.year})</p>
          </div> 
        );
      })}
    </div>
  );
}
