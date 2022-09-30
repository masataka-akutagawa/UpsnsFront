<template>
  <v-container fluid fill-height>
    <v-row no-gutters justify="center">
      <h3>検索</h3>
    </v-row>
    <v-row no-gutters justify="center">
      <v-radio-group v-model="selectedType" mandatory>
        <v-radio
          v-for="searchType in searchTypes"
          :label="searchType.label"
          :value="searchType.id"
          :key="searchType.id"
        />
      </v-radio-group>
    </v-row>

    <v-row no-gutters justify="center">
      <general-input
        :value="value"
        :message="searchTypes[selectedType].label"
        @input="value = $event"
      />
    </v-row>

    <v-row no-gutters justify="center">
      <general-button
        @button-click="search(value)"
        :buttonText="buttonText"
        :height="height"
        :width="width"
        :disabled="value == ''"
      />
    </v-row>
  </v-container>
</template>

<script>
import GeneralInput from "../atoms/inputs/GeneralInput.vue";
import GeneralButton from "../atoms/buttons/GeneralButton.vue";
export default {
  name: "SearchForm",
  components: {
    "general-button": GeneralButton,
    "general-input": GeneralInput,
  },
  data: () => ({
    selectedType: 0,
    valid: false,
    value: "",
    buttonText: "検索",
    height: 28,
    width: 100,
    searchTypes: [
      {
        id: 0,
        label: "#検索",
      },
      {
        id: 1,
        label: "キーワード検索",
      },
    ],
  }),
  methods: {
    search() {
      this.$router.push({
        path: "/search",
        query: {
          searchType: this.selectedType,
          word: this.value,
        },
      });
    },
  },
};
</script>

<style>
</style>