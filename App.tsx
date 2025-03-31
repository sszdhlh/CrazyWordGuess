import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
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
  const [wordCategory, setWordCategory] = React.useState('基础');

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
          <TouchableOpacity
            style={[
              styles.optionButton, 
              wordCategory === '自定义' && styles.selectedOption
            ]}
            onPress={() => setWordCategory('自定义')}
          >
            <Text style={styles.optionText}>自定义</Text>
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
  const [currentWord, setCurrentWord] = React.useState('苹果');
  
  // 模拟词库
  const basicWords = ['苹果', '电脑', '手机', '太阳', '月亮', '书本', '铅笔', '眼镜', '手表', '汽车'];
  const advancedWords = ['人工智能', '量子力学', '区块链', '虚拟现实', '元宇宙', '黑洞', '纳米技术', '基因编辑', '神经网络', '可再生能源'];
  
  // 根据类别选择词库
  const wordList = wordCategory === '基础' ? basicWords : advancedWords;
  
  // 获取随机词语
  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  };
  
  // 游戏计时器
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          navigation.navigate('Result', { score });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 处理正确答案
  const handleCorrect = () => {
    setScore(score + 1);
    setCurrentWord(getRandomWord());
  };
  
  // 处理跳过
  const handleSkip = () => {
    setCurrentWord(getRandomWord());
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
  const { score } = route.params;
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>游戏结束</Text>
      <Text style={styles.resultScore}>{score}</Text>
      
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionContainer: {
    flexDirection: 'row',
    height: '35%',
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
    fontSize: 48,
    color: '#ffffff',
  },
  
  // 结果页面
  resultScore: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 50,
  },
});
