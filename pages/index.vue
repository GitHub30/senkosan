<template>
  <div class="container">
    <h1 class="title">
      仙狐さんAIスピーカーなのじゃ
    </h1>
    <p class="subtitle">
      以下のことばを話してほしいのじゃ
    </p>
    <ul class="subtitle commands">
      <li>うやん</li>
      <li>うゆん</li>
      <li>ただいま</li>
    </ul>
    <div>
      <dots class="google-dots" />
      <small v-if="ready">お話ください</small>
      <small v-else>学習中</small>
    </div>
    <b-button
      v-if="ready"
      v-b-modal.modal-1
      variant="outline-primary"
      class="tl-button"
      size="lg"
      @click="onTransferLearningClick"
    >
      転移学習するのじゃ！
    </b-button>
    <b-modal
      id="modal-1"
      title="録音するのじゃ"
      ok-title="転移学習するのじゃ"
      @ok="retrain"
    >
      <ul class="subtitle commands">
        <li>
          うやん({{ transferLearning.うやん }}/8)
          <b-button
            variant="outline-primary"
            @click="collectExample('うやん', $event.target)"
          >
            録音する
          </b-button>
        </li>
        <li>
          うゆん({{ transferLearning.うゆん }}/8)
          <b-button
            variant="outline-primary"
            @click="collectExample('うゆん', $event.target)"
          >
            録音する
          </b-button>
        </li>
        <li>
          ただいま({{ transferLearning.ただいま }}/8)
          <b-button
            variant="outline-primary"
            @click="collectExample('ただいま', $event.target)"
          >
            録音する
          </b-button>
        </li>
      </ul>
    </b-modal>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs' // eslint-disable-line no-unused-vars
import * as speechCommands from '@tensorflow-models/speech-commands'
import Dots from '~/components/Dots.vue'

export default {
  components: {
    Dots
  },
  data() {
    return {
      transferRecognizer: null,
      ready: false,
      transferLearning: {
        うやん: 0,
        うゆん: 0,
        ただいま: 0
      },
      audios: {
        うやん: [],
        うゆん: [],
        ただいま: []
      }
    }
  },
  async mounted() {
    this.audios['うやん'] = [
      new Audio('uyan1.wav'),
      new Audio('uyan2.wav'),
      new Audio('uyan3.wav'),
      new Audio('uyan4.wav'),
      new Audio('uyan5.wav')
    ]
    this.audios['うゆん'] = [
      new Audio('uyun1.wav'),
      new Audio('uyun2.wav'),
      new Audio('uyun3.wav')
    ]
    this.audios['ただいま'] = [
      new Audio('otukare1.wav'),
      new Audio('otukare2.wav')
    ]
    /* eslint-disable arrow-parens */
    this.prepare(
      await fetch('2019-06-28T17.40.23.637Z.bin').then((r) => r.arrayBuffer())
    )
  },
  methods: {
    /* eslint-disable space-before-function-paren */
    start: async function() {
      // When calling `create()`, you must provide the type of the audio input.
      // The two available options are `BROWSER_FFT` and `SOFT_FFT`.
      // - BROWSER_FFT uses the browser's native Fourier transform.
      // - SOFT_FFT uses JavaScript implementations of Fourier transform
      //   (not implemented yet).
      const recognizer = speechCommands.create('BROWSER_FFT')

      // Make sure that the underlying model and metadata are loaded via HTTPS
      // requests.
      await recognizer.ensureModelLoaded()

      // See the array of words that the recognizer is trained to recognize.
      console.log(recognizer.wordLabels()) // eslint-disable-line no-console

      // `listen()` takes two arguments:
      // 1. A callback function that is invoked anytime a word is recognized.
      // 2. A configuration object with adjustable fields such a
      //    - includeSpectrogram
      //    - probabilityThreshold
      //    - includeEmbedding
      recognizer.listen(
        (result) => {
          // - result.scores contains the probability scores that correspond to
          //   recognizer.wordLabels().
          // - result.spectrogram contains the spectrogram of the recognized word.
          const score = Math.max(...result.scores)
          /* eslint-disable no-console */
          console.log(
            recognizer.wordLabels()[result.scores.indexOf(score)],
            score
          )
        },
        {
          includeSpectrogram: true,
          probabilityThreshold: 0.75
        }
      )

      // Stop the recognition in 10 seconds.
      setTimeout(() => recognizer.stopListening(), 10e3)
    },
    tl: async function() {
      const baseRecognizer = speechCommands.create('BROWSER_FFT')
      await baseRecognizer.ensureModelLoaded()

      // Each instance of speech-command recognizer supports multiple
      // transfer-learning models, each of which can be trained for a different
      // new vocabulary.
      // Therefore we give a name to the transfer-learning model we are about to
      // train ('colors' in this case).
      const transferRecognizer = baseRecognizer.createTransfer('colors')

      // Call `collectExample()` to collect a number of audio examples
      // via WebAudio.
      const colors = ['うやん', 'うゆん', 'ただいま', '_background_noise_']
      for (const color of colors) {
        for (let i = 0; i < 8; i++) {
          console.log(color, i)
          if (color === '_background_noise_') {
            await transferRecognizer.collectExample(color, {
              durationSec: 10
            })
          } else {
            await transferRecognizer.collectExample(color, {
              durationSec: 2
            })
          }
        }
      }
      // ... You would typically want to put `collectExample`
      //     in the callback of a UI button to allow the user to collect
      //     any desired number of examples in random order.

      // You can check the counts of examples for different words that have been
      // collect for this transfer-learning model.
      console.log(transferRecognizer.countExamples())
      // e.g., {'red': 2, 'green': 2', 'blue': 2, '_background_noise': 2};

      // Start training of the transfer-learning model.
      // You can specify `epochs` (number of training epochs) and `callback`
      // (the Model.fit callback to use during training), among other configuration
      // fields.
      await transferRecognizer.train({
        epochs: 25,
        callback: {
          onEpochEnd: (epoch, logs) => {
            console.log(
              `Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`
            )
          }
        }
      })
      this.downloadArtifacts(transferRecognizer.serializeExamples())

      // After the transfer learning completes, you can start online streaming
      // recognition using the new model.
      console.log('listening')
      await transferRecognizer.listen(
        (result) => {
          console.log(result)
          // - result.scores contains the scores for the new vocabulary, which
          //   can be checked with:
          const words = transferRecognizer.wordLabels()
          // `result.scores` contains the scores for the new words, not the original
          // words.
          for (let i = 0; i < words.length; ++i) {
            console.log(`score for word '${words[i]}' = ${result.scores[i]}`)
          }
        },
        { probabilityThreshold: 0.75 }
      )
      console.log(transferRecognizer.wordLabels())

      // Stop the recognition in 10 seconds.
      setTimeout(() => transferRecognizer.stopListening(), 10e4)
    },
    downloadArtifacts: function(artifacts) {
      // Trigger downloading of the data .bin file.
      const anchor = document.createElement('a')
      anchor.download = `${new Date().toISOString().replace(/:/g, '.')}.bin`
      anchor.href = window.URL.createObjectURL(
        new Blob([artifacts], { type: 'application/octet-stream' })
      )
      anchor.click()
    },
    uploadArtifacts: function(files) {
      const datasetFileReader = new FileReader()
      datasetFileReader.onload = (event) => {
        this.prepare(event.target.result)
      }
      datasetFileReader.readAsArrayBuffer(files[0])
    },
    prepare: async function(serialized) {
      const baseRecognizer = speechCommands.create('BROWSER_FFT')
      await baseRecognizer.ensureModelLoaded()
      this.transferRecognizer = baseRecognizer.createTransfer(
        new Date().toISOString().replace(/:/g, '.')
      )
      const clearExisting = false
      this.transferRecognizer.loadExamples(serialized, clearExisting)
      // You can check the counts of examples for different words that have been
      // collect for this transfer-learning model.
      console.log(this.transferRecognizer.countExamples())
      // e.g., {'red': 2, 'green': 2', 'blue': 2, '_background_noise': 2};
      this.train()
    },
    train: async function() {
      // Start training of the transfer-learning model.
      // You can specify `epochs` (number of training epochs) and `callback`
      // (the Model.fit callback to use during training), among other configuration
      // fields.
      await this.transferRecognizer.train({
        epochs: 10,
        callback: {
          onEpochEnd: (epoch, logs) => {
            console.log(
              `Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`
            )
          }
        }
      })
      // After the transfer learning completes, you can start online streaming
      // recognition using the new model.
      console.log('listening')
      await this.transferRecognizer.listen(
        (result) => {
          console.log(result)
          // - result.scores contains the scores for the new vocabulary, which
          //   can be checked with:
          const words = this.transferRecognizer.wordLabels()
          const score = Math.max(...result.scores)
          const word = words[result.scores.indexOf(score)]
          const audios = this.audios[word]
          audios[Math.floor(Math.random() * audios.length)].cloneNode().play()
          // `result.scores` contains the scores for the new words, not the original
          // words.
          for (let i = 0; i < words.length; ++i) {
            console.log(`score for word '${words[i]}' = ${result.scores[i]}`)
          }
        },
        { probabilityThreshold: 0.75 }
      )
      console.log(this.transferRecognizer.wordLabels())

      this.ready = true
    },
    collectExample: async function(label, element) {
      element.textContent = '録音中'
      await this.transferRecognizer.collectExample(label, {
        durationSec: 2
      })
      element.textContent = '録音する'
      this.transferLearning[label]++
    },
    retrain: async function() {
      this.ready = false
      console.log('retrain start')
      for (let i = 0; i < 8; i++) {
        await this.transferRecognizer.collectExample('_background_noise_', {
          durationSec: 10
        })
      }
      console.log(this.transferRecognizer.countExamples())
      this.train()
    },
    onTransferLearningClick: function() {
      console.log('stop recognizer')
      this.transferRecognizer.stopListening()
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: url('~assets/top-main2-opacity40.jpg');
  background-size: cover;
}

.title {
  font-family: LightNovel, 'Quicksand', 'Source Sans Pro', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  margin-bottom: 32px;
  font-weight: 300;
  color: #ffc107;
  text-stroke: 1px #ffa000;
  -webkit-text-stroke: 1px #ffa000;
  text-shadow: black 0 0 5px;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: bold;
  font-size: 32px;
  word-spacing: 5px;
  font-family: LightNovel;
}

.commands {
  text-align: left;
  white-space: nowrap;
}

.links {
  padding-top: 15px;
}

.google-dots {
  margin-top: 16px;
  margin-bottom: 8px;
}

.tl-button {
  margin-top: 32px;
  font-family: LightNovel;
  color: #ffd54f;
  border-color: #ff6f00;
  text-stroke: 1px #ff6f00;
  -webkit-text-stroke: 1px #ff6f00;
}
</style>
