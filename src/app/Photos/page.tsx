import Memories from "@/components/PhotoComponents/Memories";
import {Api} from '@/services/APi'
import { useMemoriesStore } from "../../store/MemoriesStore";
import Modal from "@/components/Modals/Modal";


export default async function PhotosPage() {
  const memories = await Api.Memories.getAll()
  useMemoriesStore.setState({memories})

  return (
    <section id="photos">
      <Memories memories={memories} />
      <Modal />
    </section>
  );
}
