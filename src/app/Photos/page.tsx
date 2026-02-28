import Memories from "@/components/PhotoComponents/Memories";
import {Api} from '@/services/APi'
import { useMemoriesStore } from "../../store/MemoriesStore";

export default async function PhotosPage() {
  const memories = await Api.Memories.getAll()
  useMemoriesStore.setState({memories})
  return (
    <section id="photos">
      <Memories memories={memories} />
    </section>
  );
}
