<template>
  <div :class="{ dictTagInline: inline }">
    <template v-for="(item, index) in options">
      <template v-if="values.includes(item.value)">
        <span
          v-if="
            elTagType == 'default' ||
            item.elTagType == 'default' ||
            !item.elTagType
          "
          :key="item.value"
          :index="index"
          :class="item.elTagClass"
        >
          {{ item.label }}
        </span>

        <template v-else-if="elTagType == 'tag'">
          <el-tag :type="item.elTagType"> {{ item.label }}</el-tag>
        </template>

        <div
          v-else
          :key="index"
          :index="index"
          :class="{ [`${item.elTagType}--tag`]: true, 'point-tag': true }"
        >
          <div></div>
          <span>
            {{ item.label }}
          </span>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  // 数据
  options: {
    type: Array,
    default: null,
  },
  // 当前的值
  value: [Number, String, Array],
  elTagType: {
    type: String,
    default: "",
  },
  inline: {
    type: Boolean,
    default: false,
  },
});

const values = computed(() => {
  if (props.value !== null && typeof props.value !== "undefined") {
    return Array.isArray(props.value) ? props.value : [String(props.value)];
  } else {
    return [];
  }
});

//代码可以覆盖字典的样式
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.module";

.dictTagInline {
  display: inline;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

%tag {
  // 编译后不会出现在css文件中
  //公共代码；
  display: flex;
  justify-content: left;
  align-content: center;
  align-items: center;

  div {
    width: 5px;
    height: 5px;
    border-radius: 3px 3px 3px 3px;
    opacity: 1;
  }

  span {
    padding-left: 5px;
  }
}

.point-tag {
  @extend %tag;
}

.primary--tag {
  span {
    color: $--color-primary;
  }

  div {
    background: $--color-primary;
  }
}

.success--tag {
  span {
    color: $--color-success;
  }

  div {
    background: $--color-success;
  }
}

.warning--tag {
  span {
    color: $--color-warning;
  }

  div {
    background: $--color-warning;
  }
}

.info--tag {
  span {
    color: $--color-info;
  }

  div {
    background: $--color-info;
  }
}

.danger--tag {
  span {
    color: $--color-danger;
  }

  div {
    background: $--color-danger;
  }
}

.finished--tag {
  span {
    color: #36cfc9;
  }

  div {
    background: #36cfc9;
  }
}

.waitHandle--tag {
  span {
    color: #a259f4;
  }

  div {
    background: #a259f4;
  }
}

.waitReceive--tag {
  span {
    color: #1890ff;
  }

  div {
    background: #1890ff;
  }
}

.inProgress--tag {
  span {
    color: #ff976a;
  }

  div {
    background: #ff976a;
  }
}
</style>
