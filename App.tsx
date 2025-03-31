import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 欢迎页面组件
const WelcomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.welcomeContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>疯狂猜词</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#f39c12' }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>开始游戏</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#5dade2' }]}
          onPress={() => navigation.navigate('Rules')}
        >
          <Text style={styles.buttonText}>规则说明</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

// 规则说明页面
const RulesScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>游戏规则</Text>
      <View style={styles.rulesContainer}>
        <Text style={styles.ruleText}>
          1. 一名玩家手持设备，屏幕上显示需要猜的词语，但持有者看不到。
        </Text>
        <Text style={styles.ruleText}>
          2. 其他玩家通过语言或肢体动作描述该词语，持有者根据描述进行猜测。
        </Text>
        <Text style={styles.ruleText}>
          3. 猜对后，持有者点击左半边区域表示正确；若放弃，则点击右半边区域表示跳过。
        </Text>
        <Text style={styles.ruleText}>
          4. 每轮有时间限制，规定时间内猜对的词语数量越多，得分越高。
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#7f8c8d', width: '80%' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>返回</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

// 游戏设置页面
const SettingsScreen = ({ navigation }: any) => {
  const [timeLimit, setTimeLimit] = React.useState(60);
  const [wordCategory, setWordCategory] = React.useState('随机');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>游戏设置</Text>
      
      <View style={styles.settingSection}>
        <Text style={styles.settingTitle}>时间设置</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton, 
              timeLimit === 30 && styles.selectedOption
            ]}
            onPress={() => setTimeLimit(30)}
          >
            <Text style={styles.optionText}>30秒</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton, 
              timeLimit === 60 && styles.selectedOption
            ]}
            onPress={() => setTimeLimit(60)}
          >
            <Text style={styles.optionText}>60秒</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton, 
              timeLimit === 90 && styles.selectedOption
            ]}
            onPress={() => setTimeLimit(90)}
          >
            <Text style={styles.optionText}>90秒</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.settingSection}>
        <Text style={styles.settingTitle}>词库选择</Text>
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={[
              styles.optionButton, 
              wordCategory === '随机' && styles.selectedOption
            ]}
            onPress={() => setWordCategory('随机')}
          >
            <Text style={styles.optionText}>随机</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton, 
              wordCategory === '基础' && styles.selectedOption
            ]}
            onPress={() => setWordCategory('基础')}
          >
            <Text style={styles.optionText}>基础</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton, 
              wordCategory === '进阶' && styles.selectedOption
            ]}
            onPress={() => setWordCategory('进阶')}
          >
            <Text style={styles.optionText}>进阶</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#f39c12', width: '80%' }]}
          onPress={() => navigation.navigate('Game', { timeLimit, wordCategory })}
        >
          <Text style={styles.buttonText}>开始游戏</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#7f8c8d', width: '80%' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>返回</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

// 游戏主界面
const GameScreen = ({ route, navigation }: any) => {
  const { timeLimit, wordCategory } = route.params;
  const [score, setScore] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(timeLimit);
  const [currentWord, setCurrentWord] = React.useState<string>('');
  const [correctWords, setCorrectWords] = React.useState<string[]>([]);
  const [wrongWords, setWrongWords] = React.useState<string[]>([]);
  const [usedWords, setUsedWords] = React.useState<string[]>([]);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  
  // useRef用于保存不需要触发重渲染的数据
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const navigationRef = React.useRef(navigation);
  const wordListRef = React.useRef<string[]>([]);
  const gameDataRef = React.useRef({
    score: 0,
    correctWords: [] as string[],
    wrongWords: [] as string[]
  });

  // 模拟词库
  const basicWords = ['苹果', '电脑', '手机', '太阳', '月亮', '书本', '铅笔', '眼镜', '手表', '汽车'];
  const advancedWords = ['人工智能', '量子力学', '区块链', '虚拟现实', '元宇宙', '黑洞', '纳米技术', '基因编辑', '神经网络', '可再生能源'];
  const transportWords = ['自行车', '摩托车', '汽车', '火车', '飞机', '轮船', '地铁', '公交车', '出租车', '电动车'];
  const movieWords = ['泰坦尼克号', '星球大战', '哈利波特', '复仇者联盟', '阿凡达', '疯狂动物城', '无间道', '寻梦环游记', '盗梦空间', '肖申克的救赎'];
  const cityWords = ['北京', '上海', '纽约', '东京', '伦敦', '巴黎', '悉尼', '莫斯科', '罗马', '开罗'];

  // 游戏初始化 - 只执行一次
  React.useEffect(() => {
    console.log("游戏初始化");
    
    // 初始化词库
    let words: string[] = [];
    if (wordCategory === '基础') {
      words = [...basicWords];
    } else if (wordCategory === '进阶') {
      words = [...advancedWords];
    } else {
      // 随机组合所有词库
      words = [...basicWords, ...advancedWords, ...transportWords, ...movieWords, ...cityWords];
    }
    // 打乱顺序
    wordListRef.current = words.sort(() => Math.random() - 0.5);
    
    // 选择第一个词
    if (wordListRef.current.length > 0) {
      const firstWord = wordListRef.current[0];
      setCurrentWord(firstWord);
      setUsedWords([firstWord]);
    }

    // 设置导航引用
    navigationRef.current = navigation;
    
    // 标记游戏已开始
    setIsGameStarted(true);

    // 组件卸载时清理
    return () => {
      console.log("游戏组件卸载");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 将最新的状态同步到ref - 这不会导致游戏结束
  React.useEffect(() => {
    gameDataRef.current = {
      score,
      correctWords,
      wrongWords
    };
  }, [score, correctWords, wrongWords]);
  
  // 游戏计时器 - 只在游戏已开始且未结束时运行
  React.useEffect(() => {
    if (!isGameStarted || isGameOver) {
      console.log("计时器条件不满足", {isGameStarted, isGameOver});
      return;
    }
    
    console.log("启动游戏计时器");
    const timer = setInterval(() => {
      setCurrentTime((prevTime: number) => {
        console.log("当前时间:", prevTime);
        if (prevTime <= 1) {
          console.log("时间到，游戏结束");
          clearInterval(timer);
          // 设置一个短暂延迟，确保状态更新完成
          setTimeout(() => endGame(), 10);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    timerRef.current = timer;
    
    return () => {
      console.log("清理计时器");
      clearInterval(timer);
    };
  }, [isGameStarted, isGameOver]);
  
  // 游戏结束处理函数
  const endGame = React.useCallback(() => {
    console.log("执行endGame函数");
    // 先设置游戏结束标志
    setIsGameOver(true);
    
    // 使用setTimeout确保状态更新完成后再导航
    timeoutRef.current = setTimeout(() => {
      // 使用ref中保存的最新数据
      const { score, correctWords, wrongWords } = gameDataRef.current;
      
      console.log("导航到结果页面", {score, correctWordsCount: correctWords.length, wrongWordsCount: wrongWords.length});
      navigationRef.current.navigate('Result', {
        score,
        correctWords,
        wrongWords
      });
    }, 300); // 增加延迟确保状态更新完成
  }, []);
  
  // 处理正确答案
  const handleCorrect = () => {
    if (isGameOver) {
      console.log("游戏已结束，忽略操作");
      return;
    }
    
    setScore(prevScore => {
      const newScore = prevScore + 1;
      gameDataRef.current.score = newScore;
      return newScore;
    });
    
    setCorrectWords(prevWords => {
      const newCorrectWords = [...prevWords, currentWord];
      gameDataRef.current.correctWords = newCorrectWords;
      return newCorrectWords;
    });
    
    const nextWord = getRandomWord();
    setCurrentWord(nextWord);
    setUsedWords(prevWords => [...prevWords, nextWord]);
  };
  
  // 处理错误/跳过
  const handleSkip = () => {
    if (isGameOver) return;
    
    setWrongWords(prevWords => {
      const newWrongWords = [...prevWords, currentWord];
      gameDataRef.current.wrongWords = newWrongWords;
      return newWrongWords;
    });
    
    const nextWord = getRandomWord();
    setCurrentWord(nextWord);
    setUsedWords(prevWords => [...prevWords, nextWord]);
  };
  
  // 获取随机词语（确保不重复）
  const getRandomWord = () => {
    const availableWords = wordListRef.current.filter(word => !usedWords.includes(word));
    
    // 如果所有词都已使用，返回一个提示信息
    if (availableWords.length === 0) {
      return "词库已用完";
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  };
  
  return (
    <SafeAreaView style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <Text style={[styles.timerText, currentTime <= 10 && styles.timerWarning]}>
          {currentTime}
        </Text>
        <Text style={styles.scoreText}>得分: {score}</Text>
      </View>
      
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{currentWord}</Text>
      </View>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.correctButton]}
          onPress={handleCorrect}
        >
          <Text style={styles.actionText}>✓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.skipButton]}
          onPress={handleSkip}
        >
          <Text style={styles.actionText}>✗</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

// 结果页面
const ResultScreen = ({ route, navigation }: any) => {
  // 安全地从路由参数获取数据
  const params = route.params || {};
  const score = params.score || 0;
  const correctWords = Array.isArray(params.correctWords) ? params.correctWords : [];
  const wrongWords = Array.isArray(params.wrongWords) ? params.wrongWords : [];
  
  // 调试信息
  console.log("结果页面收到数据:", { score, correctWords, wrongWords });
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>游戏结束</Text>
      <Text style={styles.resultScoreLabel}>最终得分</Text>
      <Text style={styles.resultScore}>{score}</Text>
      
      <View style={styles.wordsListContainer}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.wordsSection}>
            <Text style={styles.wordsSectionTitle}>正确词语：</Text>
            <View style={styles.wordsList}>
              {correctWords.length > 0 ? (
                correctWords.map((word: string, index: number) => (
                  <View key={`correct-${index}`} style={styles.wordItem}>
                    <Text style={styles.wordItemText}>{word}</Text>
                    <Text style={styles.correctMark}>✓</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyListText}>无正确词语</Text>
              )}
            </View>
          </View>
          
          <View style={styles.wordsSection}>
            <Text style={styles.wordsSectionTitle}>错误词语：</Text>
            <View style={styles.wordsList}>
              {wrongWords.length > 0 ? (
                wrongWords.map((word: string, index: number) => (
                  <View key={`wrong-${index}`} style={styles.wordItem}>
                    <Text style={styles.wordItemText}>{word}</Text>
                    <Text style={styles.skipMark}>✗</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyListText}>无错误词语</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#f39c12', width: '80%' }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>再玩一次</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#3498db', width: '80%' }]}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.buttonText}>返回主菜单</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

// 创建导航堆栈
const Stack = createStackNavigator();

// 主应用组件
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Rules" component={RulesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 样式
const styles = StyleSheet.create({
  // 通用容器样式
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  
  // 欢迎页面
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 60,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3498db',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // 规则页面
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 30,
  },
  rulesContainer: {
    width: '90%',
    marginBottom: 40,
  },
  ruleText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
    lineHeight: 24,
  },
  
  // 设置页面
  settingSection: {
    width: '90%',
    marginBottom: 30,
  },
  settingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
  },
  optionText: {
    color: '#333333',
    fontWeight: '500',
  },
  
  // 游戏页面
  gameContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  timerWarning: {
    opacity: 0.8,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    margin: 20,
    borderRadius: 12,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionContainer: {
    flexDirection: 'row',
    height: '25%',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#2ecc71',
  },
  skipButton: {
    backgroundColor: '#e74c3c',
  },
  actionText: {
    fontSize: 36,
    color: '#ffffff',
  },
  
  // 结果页面
  resultScoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  resultScore: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 20,
  },
  wordsListContainer: {
    width: '90%',
    height: 300,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 8,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  wordsSection: {
    marginBottom: 15,
  },
  wordsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  wordsList: {
    marginBottom: 15,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  wordItemText: {
    fontSize: 16,
    color: '#333333',
  },
  correctMark: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  skipMark: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  emptyListText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});
