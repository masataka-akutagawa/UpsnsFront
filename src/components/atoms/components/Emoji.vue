<template>
  <dropdown-toolbar title="emoji" :visible="visible" @on-change="onChange($event)">
    <template #overlay>
      <div class="emoji-container">
        <ol class="emojis">
          <li
            v-for="(emoji, index) of emojis"
            :key="`emoji-${index}`"
            @click="emojiHandler(emoji)"
            v-text="emoji"
          ></li>
          <!-- ここでどうにかする、何個分横につけるかどうか 、リストを横並びにする-->
        </ol>
      </div>
    </template>
    <template #trigger>
        <span class="material-symbols-outlined">
          mood
        </span>
     <!-- マークダウンをコンパイルするやつつくる -->
    </template>
  </dropdown-toolbar>
</template>

<script>
import { emojis } from '../../../const/emoji';
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

export default {
  name: "EmojiExtension",
  data(){
    return {
      emojis:emojis,
      visible:false,
      text:'',
    }
  },
  props:{
    editorId:{
      type:String,
    default() {
        return "md-editor-v3";
      },
    },
  },
  components:{
    'dropdown-toolbar':MdEditor.DropdownToolbar
  },
methods : {
  emojiHandler  (emoji)  {
    const self = this;
  // 获取输入框
  const textarea = document.querySelector(
    `#${self.editorId}-textarea`
  ); 
  // 获取选中的内容
  const selection = window.getSelection()?.toString();
  // 获取鼠标位置
  const endPoint = textarea.selectionStart;
  // 根据鼠标位置分割旧文本
  // 前半部分
  const prefixStr = textarea.value.substring(0, endPoint);
  // 后半部分
  const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));
  self.$emit('onChange', `${prefixStr}${emoji}${suffixStr}`);
  setTimeout(() => {
    textarea.setSelectionRange(endPoint, endPoint + 1);
    textarea.focus();
  }, 0);
},
onChange  (visible)  {
  const self = this;
  self.visible = visible;
},
},
};
</script>

<style>
.emojis {
  column-count: 10;
}
</style>
