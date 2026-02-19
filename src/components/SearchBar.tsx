import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
export function SearchBar() {
  return (
    <div>
         <Input placeholder="Busca tus fotos" leftSection={<IconSearch size={16} />} />
    </div>
 
  );
}