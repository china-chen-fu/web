<template>
<div>
11

</div>
</template>

<script setup>
const generateColumns = (length = 10, prefix = 'column-', props) =>
Array.from({ length }).map((_, columnIndex) => ({
  ...props,
  key: `${prefix}${columnIndex}`,
  dataKey: `${prefix}${columnIndex}`,
  title: `Column ${columnIndex}`,
  width: 150,
}))
const columns = generateColumns(10)

const generateData = (
    columns,
    length = 200,
    prefix = 'row-'
) =>
    Array.from({ length }).map((_, rowIndex) => {
      return columns.reduce(//给对象设置初始属性，每次添加完属性继续添加
          (rowData, column, columnIndex) => {
            rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
            return rowData
          },
          {
            id: `${prefix}${rowIndex}`,
            parentId: null,
          }
      )
    })

const tableData =generateData(columns,400)
</script>

<style scoped lang="scss">

</style>