import './pugImport';
import '../css/base.scss';

// reactのエントリーポイント
import './react/reactEntry';

console.log('test');

// HMRに失敗してもJSがリロードしてくれないので強制的にリロードを実行する
if (module.hot) {
  module.hot.accept(console.error);
  module.hot.dispose(() => {
    window.location.reload();
  });
}
