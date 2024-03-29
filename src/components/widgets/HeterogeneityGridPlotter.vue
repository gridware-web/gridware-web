<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { OccupiedCell, RawCell } from '@types/AnalysisGroups';
import { getOccupiedCount } from '@utils/heterogeneity';

const emits = defineEmits<{
  (event: 'update:occupiedCells', occupiedCellsList: OccupiedCell[]): void;
}>();

const props = defineProps({
  yCellCount: {
    type: Number,
    required: true,
  },
  xCellCount: {
    type: Number,
    required: true,
  },
  occupiedCells: {
    type: Array as PropType<{ x: number; y: number; count: number }[]>,
    required: true,
  },
  nodes: {
    // @ts-ignore
    type: Object as PropType<any>,
    required: true,
  },
});

const occupiedCellsList = ref<OccupiedCell[]>([]);

watch(
  () => props.occupiedCells,
  () => {
    occupiedCellsList.value = [];
  }
);

function getCellOrder(currentCell: RawCell, lastCell: RawCell) {
  const lastCellCount = lastCell.count;
  const lastCellOrder =
    lastCell?.order && lastCell.order > 0 ? lastCell.order : 1;
  const currentCellCount = currentCell.count;
  return lastCellCount === currentCellCount ? lastCellOrder : lastCellOrder + 1;
}

function handleCountOccupied(x: number, y: number) {
  const occupiedCount = getOccupiedCount(
    x,
    y,
    props.xCellCount,
    props.yCellCount,
    props.nodes
  );
  if (occupiedCount > 0) {
    // if cell not in occupied cells list, add it
    if (
      occupiedCellsList.value.filter(i => i.x === x && i.y === y).length === 0
    ) {
      occupiedCellsList.value.push({ x, y, count: occupiedCount, order: -1 });
    }
    const tempOccupiedCellsList = occupiedCellsList.value.sort((a, b) => {
      if (a.count !== b.count) {
        return a.count - b.count;
      } else {
        if (a.x !== b.x) {
          return a.x - b.x;
        } else {
          return a.y - b.y;
        }
      }
    });

    for (let i = 0; i < tempOccupiedCellsList.length; i++) {
      const currentCell = tempOccupiedCellsList[i];
      const lastCell = i >= 1 ? tempOccupiedCellsList[i - 1] : currentCell;
      // currentCell.order = lastCell.count === currentCell.count ? lastCell.order : i + 1;
      currentCell.order = getCellOrder(currentCell, lastCell);
      // currentCell.order = i + 1
      tempOccupiedCellsList[i] = currentCell;
    }

    occupiedCellsList.value = tempOccupiedCellsList;

    return tempOccupiedCellsList.find(i => i.x === x && i.y === y);
  } else {
    // if no event happened in this cell, then the event count is 0
    return { order: 0, count: 0 };
  }
}

emits('update:occupiedCells', occupiedCellsList.value);

watch(
  () => occupiedCellsList.value,
  () => {
    emits('update:occupiedCells', occupiedCellsList.value);
  }
);
</script>

<template>
  <div class="heterogeneity__container">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <tbody>
        <tr v-for="yCount in props.yCellCount">
          <td
            class="border dark:bg-gray-800 dark:border-gray-700 table-cell"
            v-for="xCount in props.xCellCount"
          >
            {{
              0 !==
              handleCountOccupied(xCount - 1, props.yCellCount - yCount)?.order
                ? `#${
                    handleCountOccupied(xCount - 1, props.yCellCount - yCount)
                      ?.order
                  }`
                : ''
            }}
            <br />
            {{
              0 !==
              handleCountOccupied(xCount - 1, props.yCellCount - yCount)?.order
                ? `${
                    handleCountOccupied(xCount - 1, props.yCellCount - yCount)
                      ?.count
                  }`
                : ''
            }}
          </td>
        </tr>
      </tbody>
    </table>
    Cell #
  </div>
</template>

<style scoped lang="scss">
table .table-cell {
  width: 40px;
  height: 40px;
  text-align: center;
}
</style>
