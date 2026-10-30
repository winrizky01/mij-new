
import { computed, ref } from "vue";
import {
    BLOCK_REGISTRY,
    createBlock,
} from "../config/blockRegistry";

export function useWebsiteBuilder(initialBlocks = []) {
    const blocks = ref(normalizeBlocks(initialBlocks));
    const selectedBlockId = ref(null);
    const isDirty = ref(false);

    const selectedBlock = computed(() =>
        findBlock(blocks.value, selectedBlockId.value)
    );

    const enabledBlocks = computed(() =>
        blocks.value.filter((block) => block.enabled !== false)
    );

    const blockCount = computed(() =>
        countBlocks(blocks.value)
    );

    // Tambah blok ke level halaman (tetap kompatibel).
    function addBlock(type, overrides = {}) {
        validateBlockType(type);

        const block = makeBlock(type, overrides);

        blocks.value = [...blocks.value, block];
        selectedBlockId.value = block.id;
        isDirty.value = true;

        return block;
    }

    // Tambah blok ke dalam Container atau Columns.
    // columnIndex dimulai dari 0.
    function addChildBlock(parentId, type, overrides = {}) {
        validateBlockType(type);

        const parent = findBlock(blocks.value, parentId);

        if (!parent || !["container", "columns"].includes(parent.type)) {
            return null;
        }

        const block = makeBlock(type, overrides);

        if (parent.type === "columns") {
            block.columnIndex = normalizeColumnIndex(
                overrides.columnIndex,
                parent.columns
            );
        } else {
            delete block.columnIndex;
        }

        parent.children = [
            ...(parent.children ?? []),
            block,
        ];

        blocks.value = [...blocks.value];

        selectedBlockId.value = block.id;
        isDirty.value = true;

        return block;
    }

    function selectBlock(idOrBlock) {
        const id =
            idOrBlock && typeof idOrBlock === "object"
                ? idOrBlock.id
                : idOrBlock;

        selectedBlockId.value =
            id != null && findBlock(blocks.value, id)
                ? id
                : null;
    }

    function updateBlock(id, patch) {
        const block = findBlock(blocks.value, id);

        if (!block) return false;

        const safePatch = { ...patch };
        delete safePatch.id;
        delete safePatch.type;

        Object.assign(block, safePatch);

        // Pastikan perubahan children dan properti bersarang terdeteksi.
        blocks.value = [...blocks.value];
        isDirty.value = true;

        return true;
    }

    function deleteBlock(id) {
        const result = removeBlock(blocks.value, id);

        if (!result.removed) return false;

        blocks.value = result.blocks;

        if (selectedBlockId.value === id) {
            selectedBlockId.value = null;
        }

        isDirty.value = true;
        return true;
    }

    function moveBlock(id, direction) {
        const result = moveNestedBlock(
            blocks.value,
            id,
            Number(direction)
        );

        if (!result) return false;

        blocks.value = result;
        isDirty.value = true;
        return true;
    }

    function toggleBlock(id) {
        const block = findBlock(blocks.value, id);

        if (!block) return false;

        return updateBlock(id, {
            enabled: block.enabled === false,
        });
    }

    function replaceBlocks(nextBlocks = []) {
        blocks.value = normalizeBlocks(nextBlocks);

        if (
            selectedBlockId.value &&
            !findBlock(blocks.value, selectedBlockId.value)
        ) {
            selectedBlockId.value = null;
        }

        isDirty.value = false;
    }

    function markSaved() {
        isDirty.value = false;
    }

    function getBlocksPayload() {
        return JSON.parse(JSON.stringify(blocks.value));
    }

    return {
        blocks,
        selectedBlockId,
        selectedBlock,
        enabledBlocks,
        blockCount,
        isDirty,
        addBlock,
        addChildBlock,
        selectBlock,
        updateBlock,
        deleteBlock,
        moveBlock,
        toggleBlock,
        replaceBlocks,
        markSaved,
        getBlocksPayload,
    };
}

function validateBlockType(type) {
    if (!BLOCK_REGISTRY[type]) {
        throw new Error(`Tipe blok "${type}" tidak terdaftar.`);
    }
}

function makeBlock(type, overrides = {}) {
    const block = {
        ...createBlock(type),
        ...overrides,
        id: overrides.id ?? createFallbackId(),
        type,
    };

    block.children = normalizeBlocks(block.children ?? []);

    return block;
}

function normalizeBlocks(items) {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
        const definition = BLOCK_REGISTRY[item.type];

        if (!definition) {
            return {
                ...item,
                id: item.id ?? createFallbackId(),
                enabled: item.enabled !== false,
                children: normalizeBlocks(item.children ?? []),
            };
        }

        return {
            ...createBlock(item.type),
            ...item,
            id: item.id ?? createFallbackId(),
            type: item.type,
            enabled: item.enabled !== false,
            children: normalizeBlocks(item.children ?? []),
        };
    });
}

function findBlock(items, id) {
    if (id == null) return null;

    for (const block of items) {
        if (block.id === id) return block;

        const nested = findBlock(block.children ?? [], id);

        if (nested) return nested;
    }

    return null;
}

function countBlocks(items) {
    return items.reduce(
        (total, block) =>
            total + 1 + countBlocks(block.children ?? []),
        0
    );
}

function removeBlock(items, id) {
    let removed = false;
    const result = [];

    for (const block of items) {
        if (block.id === id) {
            removed = true;
            continue;
        }

        const nested = removeBlock(block.children ?? [], id);

        if (nested.removed) {
            removed = true;
            result.push({
                ...block,
                children: nested.blocks,
            });
        } else {
            result.push(block);
        }
    }

    return { blocks: result, removed };
}

function moveNestedBlock(items, id, direction) {
    const index = items.findIndex((block) => block.id === id);

    if (index !== -1) {
        const targetIndex = index + direction;

        if (
            !Number.isInteger(targetIndex) ||
            targetIndex < 0 ||
            targetIndex >= items.length
        ) {
            return null;
        }

        const reordered = [...items];
        const [movingBlock] = reordered.splice(index, 1);

        reordered.splice(targetIndex, 0, movingBlock);

        return reordered;
    }

    for (let i = 0; i < items.length; i++) {
        const block = items[i];
        const nested = moveNestedBlock(block.children ?? [], id, direction);

        if (nested) {
            const result = [...items];

            result[i] = {
                ...block,
                children: nested,
            };

            return result;
        }
    }

    return null;
}

function normalizeColumnIndex(value, columnCount) {
    const count = Math.max(1, Number(columnCount) || 2);
    const index = Number(value) || 0;

    return Math.min(count - 1, Math.max(0, Math.floor(index)));
}

function createFallbackId() {
    return `block-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}
