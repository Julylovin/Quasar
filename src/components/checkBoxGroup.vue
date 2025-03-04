<template>
  <div class="radio-group">
    <div v-for="(item,index) in options" :class="{'radio-item':true, 'active': activeClass[index] }"
      @click="changeItem(index)" :key="index">
      {{item.query}}
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.activeIndex = this.value
    this.activeClass = new Array(this.options.length).fill(false)
    this.activeIndex.forEach(val => {
      this.options.forEach((value, index) => {
        if (index === val) {
          this.$set(this.activeClass, val, true)
        }
      })
    })
  },
  updated () {
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    },
    isUpdate: {
      type: Boolean
    }
  },
  watch: {
    isUpdate: {
      handler (val) {
        this.activeIndex = this.value
        this.activeClass = new Array(this.options.length).fill(false)
        this.activeIndex.forEach(val => {
          this.options.forEach((value, index) => {
            if (index === val) {
              this.$set(this.activeClass, val, true)
            }
          })
        })
      }
    },
    activeIndex: {
      deep: true,
      handler (val) {
        this.$emit('checkboxChange', val)
      }
    }
  },
  data () {
    return {
      activeIndex: [],
      activeClass: []
    }
  },
  methods: {
    changeItem (val) {
      var _this = this
      if (_this.activeIndex.indexOf(val) !== -1) {
        let i = _this.activeIndex.indexOf(val)
        _this.activeIndex.splice(i, 1)
        _this.$set(_this.activeClass, val, false)
      } else {
        _this.activeIndex.push(val)
        _this.$set(_this.activeClass, val, true)
      }
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
    /* height: 44px; */
    background: #ffffff;
    border-radius: 25px;
    border: 1px solid #d5ecec;
    line-height: 44px;
    padding-left: 20px;
    color: #384256;
    opacity: 0.85;
    font-size: 16px;
    margin: 24px 0 0 0;
  }

  .active {
    background: #6ac4bf;
    color: #FFFFFF;
  }
</style>
