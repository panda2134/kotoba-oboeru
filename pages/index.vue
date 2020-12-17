<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">
            欢迎使用！
          </v-card-title>
          <v-card-text>使用之前，你也许希望看看页面底部的使用方法，特别是关于输入的部分。祝学习愉快！</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-2"
              text
              @click="dialog = false"
            >
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card class="mb-5">
        <v-card-title v-if="!review">
          <v-btn
            depressed
            :disabled="courseIndex === 0"
            @click="() => {courseIndex--; wordIndex = 0;}"
          >
            <v-icon left>
              mdi-arrow-left
            </v-icon>
            上一课
          </v-btn>
          <v-spacer />
          <span> {{ course[courseIndex].display_name }} </span>
          <v-spacer />
          <v-btn
            v-show="!review"
            depressed
            :disabled="courseIndex === course.length - 1"
            @click="() => {courseIndex++; wordIndex = 0;}"
          >
            下一课
            <v-icon right>
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-title v-else>
          <v-btn depressed class="mr-5" @click="() => {review = false}">
            <v-icon left>
              mdi-arrow-left
            </v-icon>
            返回
          </v-btn>
          <span>复习模式</span>
          <v-spacer />
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center justify-space-between">
          <div class="text-h3 mt-10 mb-10">
            {{ !wordList || !wordList.length || !wordList[wordIndex] ?
              'Loading...' : wordList[wordIndex].meaning }}
          </div>
          <v-text-field
            v-model="input"
            label="假名/罗马音(enter确认)"
            :success="!newWord && correct"
            :error="!newWord && !correct"
            @keydown.enter="checkAnswer"
            @blur="checkAnswer"
          >
            <v-icon v-if="newWord" slot="append" style="color: transparent !important;">
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon
              v-if="!newWord && correct"
              slot="append"
              color="green"
            >
              mdi-checkbox-marked-circle
            </v-icon>
            <v-icon
              v-if="!newWord && !correct"
              slot="append"
              color="red"
            >
              mdi-cancel
            </v-icon>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!wordList.length || (wordIndex === 0)"
            small
            color="secondary"
            @click="() => {wordIndex--;}"
          >
            <v-icon left>
              mdi-arrow-left
            </v-icon>
            前一词
          </v-btn>
          <v-spacer />
          <span>第 {{ wordIndex + 1 }} 个/共 {{ wordList ? wordList.length : -1 }} 个</span>
          <v-spacer />
          <v-btn
            :disabled="!wordList.length || (wordIndex === wordList.length - 1)"
            small
            color="primary"
            @click="() => {wordIndex++;}"
          >
            后一词
            <v-icon right>
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mb-5">
        <v-card-title>
          <span>错误列表</span>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="!(selectedErrors.length)"
            @click="() => {reviewWords=selectedErrors; review = true; wordIndex = 0;}"
          >
            <v-icon left>
              mdi-book-multiple
            </v-icon>
            复习
          </v-btn>
          <v-btn
            class="ml-2"
            color="error"
            :disabled="!(selectedErrors.length)"
            @click="removeSelectedErrors"
          >
            <v-icon left>
              mdi-delete
            </v-icon>
            删除
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-model="selectedErrors"
            :headers="errorHeaders"
            :items="errorList"
            :items-per-page="5"
            item-key="meaning"
            show-select
          />
        </v-card-text>
      </v-card>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            包含哪些单词？
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            《新世纪日本语教程（初级）》5-12课。感谢编者老师们，也感谢 <a href="https://github.com/Rabbit-Hu">@Rabbit-Hu</a> 提供单词表。
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            如何输入？
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            可以直接输入片假名/平假名，也可以采用罗马音输入。大写罗马音会翻译成片假名，小写会翻译成平假名，减号对应片假名长音符号。拼写上一些注意事项举例如下表：
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      罗马字
                    </th>
                    <th class="text-left">
                      假名
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>KONPYU-TA-</td>
                    <td>コンピューター</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>SHANHAI</td>
                    <td>シャンハイ</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>tsunami</td>
                    <td>つなみ</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>honbun</td>
                    <td>ほんぶん</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td>yoro<b>shi</b>ku</td>
                    <td>よろしく</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            作者？
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            panda2134. 如果有空欢迎来我 <a href="https://blog.panda2134.site">博客</a> 看看。
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            我的错题保存在哪里？
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            保存在浏览器的本地存储中。我不会收集你的任何信息。
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            晚上看白色太晃眼睛？
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            在设置里面把手机或者电脑改成黑色主题，刷新页面后配色会跟随操作系统的配置。
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-snackbar
        v-model="currentCourseDone"
        :timeout="2000"
      >
        列表中单词已背完！
        <template
          v-slot:action="{ attrs }"
        >
          <v-btn
            v-bind="attrs"
            color="blue"
            text
            @click="currentCourseDone = false"
          >
            关闭
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex'
import { romajiToKana } from 'simple-romaji-kana'

export default {
  async asyncData ({ $content }) {
    const { course } = await $content('list').fetch()

    for (const courseInfo of course) {
      const courseFileName = courseInfo.file_name
      const wordFile = await $content('words/' + courseFileName, { text: true }).fetch()
      courseInfo.content = wordFile.body
    }

    return { course }
  },
  data () {
    return {
      input: '',
      wordIndex: 0,
      courseIndex: 0,
      review: false,
      currentCourseDone: false,
      reviewWords: [],
      selectedErrors: [],
      correct: false,
      newWord: true,
      errorHeaders: [
        { text: '中文', value: 'meaning' },
        { text: '假名', value: 'kana' },
        { text: '日语汉字', value: 'kanji' }
      ]
    }
  },
  computed: {
    errorList: {
      get () {
        return this.$store.state.localStorage.errorList
      },
      set (value) {
        this.setError(value)
      }
    },
    dialog: {
      get () {
        return !(this.$store.state.localStorage.usedBefore)
      },
      set (value) {
        this.markUsed()
      }
    },
    wordList () {
      if (this.review) {
        return this.reviewWords
      } else {
        return this.course[this.courseIndex].content
      }
    }
  },
  methods: {
    ...mapMutations({
      appendError: 'localStorage/appendError',
      removeError: 'localStorage/removeError',
      setError: 'localStorage/setError',
      markUsed: 'localStorage/markUsed'
    }),
    checkAnswer () {
      const { kana } = this.wordList[this.wordIndex]
      if (this.input.length === 0) {
        return
      }

      this.correct = (this.input === kana || romajiToKana(this.input) === kana)

      if (!(this.correct)) {
        this.appendError(this.wordList[this.wordIndex])
      }
      this.newWord = false
      setTimeout(() => {
        this.newWord = true
        if (this.correct) {
          if (this.wordIndex < this.wordList.length - 1) {
            this.wordIndex++
            this.input = ''
          } else {
            this.currentCourseDone = true
          }
        }
      }, 1000)
      return this.correct
    },
    removeSelectedErrors () {
      [...(this.selectedErrors)].forEach((element) => {
        this.removeError(element.meaning)
      })
      this.selectedErrors = []
    }
  }
}
</script>
