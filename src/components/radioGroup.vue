<template>
  <div class="radio-group">
    <div v-for="(item,index) in options" :class="{'radio-item':true, active:activeIndex === index }"
      @click="changeItem(index)" :key="index">
      <p class="radio-item-title">{{item.query}}</p>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    var _this = this
    _this.activeIndex = _this.value
  },
  updated () {
    this.activeIndex = this.value
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    isUpdate: {
      type: Boolean
    }
  },
  watch: {
    activeIndex (val) {
      this.$emit('radioChange', val)
    }
  },
  data () {
    return {
      activeIndex: -1
    }
  },
  methods: {
    changeItem (index) {
      var _this = this
      _this.activeIndex = index
    }
  }
}
</script>

<style scoped>
  .radio-group {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .radio-item {
    width: 270px;
    background: rgba(240, 241, 245, 1);
    border-radius: 25px;
    padding-left: 20px;
    color: #8E8E93;
    font-size: 14px;
    margin: 20px 0 0 0;
  }

  .active {
    background: #6ac4bf;
    color: #FFFFFF;
  }

  .radio-item-title {
    margin: 12px auto;
  }
</style>
