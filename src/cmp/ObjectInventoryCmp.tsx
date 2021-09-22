import styled from "styled-components";
import { Inventory } from "../game/Inventory";
import { InventoryCmp } from "./InventoryCmp";

interface ObjectInventoryCmpProps {
  inventory: Inventory;
  onClose: () => void;
}

export const ObjectInventoryCmp = ({
  inventory,
  onClose,
}: ObjectInventoryCmpProps) => {
  return (
    <Overlay onClick={onClose}>
      <Container>
        <InventoryCmp items={inventory.items()} size={inventory.size()} />
      </Container>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1024px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  border: 4px solid #663931;
  padding: 4px;
  background-color: #ae956f;
  width: 256px;
`;
