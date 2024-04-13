<template>
<div class="ui vertical segment">
      <div class="flexbox">
        <div class="flex-content">
          <div>
            <model-select
              ref="select"
              :options="options"
              v-model="item"
              placeholder="Main interest"
              style="z-index: 10000"
              required=true
            >
            </model-select>
          </div>
        </div>
        <!-- <div class="flex-result">
          <table class="ui celled table">
            <thead>
            <tr>
              <th>value</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ item }}</td>
            </tr>
            </tbody>
          </table>
        </div> -->
      </div>
    </div>
  </template>

<script>
  import { ModelSelect } from "vue-search-select"
  import InterestEmbeddingData from '../../../nlp/output_embeddings.json'
  
  export default {
    data() {
        let optionsArr = Object.keys(InterestEmbeddingData).map((key) => {return {'text': key, 'value': InterestEmbeddingData[key]}});
        console.log(optionsArr)
        optionsArr.sort((a, b) => a.text > b.text ? 1 : -1)
        return {
            options: optionsArr,
            item: "",
        }
    },
    methods: {
      getSelectedItem() {
        return this.item
      },
      selectOption() {
        // select option from parent component
        this.item = this.options[1].value
      },
      openOption() {
        this.$refs.select.openOptions()
      },
    },
    components: {
      ModelSelect,
    },
  }
  </script>