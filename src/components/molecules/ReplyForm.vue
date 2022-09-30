<template>
    <v-form >
        <v-container>
            <v-textarea
                counter
                id="textarea"
                label="reply"
                :rules="rules"
                v-model = "replyComment"
                maxlength="500"
            >
            </v-textarea>
            <general-button
                @button-click="sendReply"
                :buttonText="buttonText"
                id="submitBtn"
                :height="height"
                :width="width"
                :disabled="replyComment == '' "
            />
        </v-container>
    </v-form>
</template>

<script>
import axios from "axios";
import GeneralButton from "../atoms/buttons/GeneralButton.vue";

export default {
    name: "ReplyForm",
    components: {
        "general-button": GeneralButton
    },
    data: () => ({
    valid: false,
    buttonText: "送信",
    height: 28,
    width: 100,
    message: "reply",
    replyComment: "",
    userId: Number,
    rules: [v => v.length <= 500 || 'Max 500 characters'],
    }),
    props: {
        articleId: {
            type: Number,
            required: true,
        },
        parentId: {
            type: Number,
            required: true
        }
    },
    methods: {
        //if文で記事へのリプライかリプライへのリプライかで分岐させる
        async sendReply() {
            this.userId = this.$store.getters.getUserId();
            let res;
            if(!this.parentId) {
                res = await axios.post(
                    `${process.env.VUE_APP_API_BASE_UPL}/reply`, {
                        articleId : this.articleId,
                        comment : this.replyComment,
                        userId: this.userId,
                    }
            )
            }else {
                res = await axios.post(
                     `${process.env.VUE_APP_API_BASE_UPL}/reply`,{
                        articleId : this.articleId,
                        comment: this.replyComment,
                        userId: this.userId,
                        parentId: this.parentId
                    }
                )
            }
            this.reply = res.data
            this.delete()
            this.$emit("sent");
        },

        delete(){
            this.replyComment = "";
        },
    }
}
</script>

<style>

</style>