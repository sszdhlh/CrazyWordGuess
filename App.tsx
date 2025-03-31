import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 定义排行榜记录类型
type LeaderboardRecord = {
  name: string;
  score: number;
  date: string;
  words: number;
};

// 使用全局变量存储排行榜数据（替代AsyncStorage）
const globalLeaderboard: LeaderboardRecord[] = [];

// 欢迎页面组件
const WelcomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  return (
    <LinearGradient
      colors={['#8A2BE2', '#4169E1']} // 从紫色(BlueViolet)到蓝色(RoyalBlue)的渐变
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.safeAreaContainer, { paddingTop: insets.top }]}>
        <Text style={styles.title}>疯狂猜词</Text>
        <Text style={styles.subtitle}>一起来玩吧！</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(243, 156, 18, 0.9)' }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.buttonText}>开始游戏</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(52, 152, 219, 0.9)' }]}
            onPress={() => navigation.navigate('Rules')}
          >
            <Text style={styles.buttonText}>规则说明</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(155, 89, 182, 0.9)' }]}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={styles.buttonText}>查看排行榜</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

// 规则页面组件
const RulesScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  return (
    <LinearGradient
      colors={['#8A2BE2', '#4169E1']} // 从紫色到蓝色的渐变
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.safeAreaContainer, { paddingTop: insets.top }]}>
        <Text style={styles.pageTitle}>游戏规则</Text>
        
        <View style={styles.contentCard}>
          <Text style={styles.ruleText}>1. 游戏需要至少两名玩家参与，一人拿设备，其他人描述。</Text>
          <Text style={styles.ruleText}>2. 拿设备的玩家看不到屏幕，其他玩家通过语言描述帮助猜词。</Text>
          <Text style={styles.ruleText}>3. 描述时不能直接说出词语本身或包含的字。</Text>
          <Text style={styles.ruleText}>4. 猜对一个词得1分，猜错不扣分。</Text>
          <Text style={styles.ruleText}>5. 时间结束后，统计总分，得分最高者获胜。</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'rgba(52, 152, 219, 0.9)' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>返回</Text>
        </TouchableOpacity>
        
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

// 游戏设置页面
const SettingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [timeLimit, setTimeLimit] = React.useState(60);
  const [wordCategory, setWordCategory] = React.useState('随机');
  const [wordTheme, setWordTheme] = React.useState('全部');

  return (
    <LinearGradient
      colors={['#8A2BE2', '#4169E1']} // 从紫色到蓝色的渐变
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.safeAreaContainer, { paddingTop: insets.top }]}>
        <Text style={styles.pageTitle}>游戏设置</Text>
        
        <View style={styles.contentCard}>
          <View style={styles.settingSection}>
            <Text style={styles.settingTitle}>时间设置</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  timeLimit === 30 && styles.optionButtonSelected
                ]}
                onPress={() => setTimeLimit(30)}
              >
                <Text style={[
                  styles.optionText,
                  timeLimit === 30 && styles.optionTextSelected
                ]}>30秒</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  timeLimit === 60 && styles.optionButtonSelected
                ]}
                onPress={() => setTimeLimit(60)}
              >
                <Text style={[
                  styles.optionText,
                  timeLimit === 60 && styles.optionTextSelected
                ]}>60秒</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  timeLimit === 90 && styles.optionButtonSelected
                ]}
                onPress={() => setTimeLimit(90)}
              >
                <Text style={[
                  styles.optionText,
                  timeLimit === 90 && styles.optionTextSelected
                ]}>90秒</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingSection}>
            <Text style={styles.settingTitle}>词库难度</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  wordCategory === '随机' && styles.optionButtonSelected
                ]}
                onPress={() => setWordCategory('随机')}
              >
                <Text style={[
                  styles.optionText,
                  wordCategory === '随机' && styles.optionTextSelected
                ]}>随机</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  wordCategory === '基础' && styles.optionButtonSelected
                ]}
                onPress={() => setWordCategory('基础')}
              >
                <Text style={[
                  styles.optionText,
                  wordCategory === '基础' && styles.optionTextSelected
                ]}>基础</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton, 
                  wordCategory === '进阶' && styles.optionButtonSelected
                ]}
                onPress={() => setWordCategory('进阶')}
              >
                <Text style={[
                  styles.optionText,
                  wordCategory === '进阶' && styles.optionTextSelected
                ]}>进阶</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingSection}>
            <Text style={styles.settingTitle}>词库主题</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeScrollView}>
              <View style={styles.themeOptionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '全部' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('全部')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '全部' && styles.optionTextSelected
                  ]}>全部</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '日常' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('日常')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '日常' && styles.optionTextSelected
                  ]}>日常</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '科技' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('科技')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '科技' && styles.optionTextSelected
                  ]}>科技</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '文学' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('文学')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '文学' && styles.optionTextSelected
                  ]}>文学</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '流行语' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('流行语')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '流行语' && styles.optionTextSelected
                  ]}>流行语</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '网络梗' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('网络梗')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '网络梗' && styles.optionTextSelected
                  ]}>网络梗</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '地理' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('地理')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '地理' && styles.optionTextSelected
                  ]}>地理</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '影视' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('影视')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '影视' && styles.optionTextSelected
                  ]}>影视</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton, 
                    wordTheme === '交通' && styles.optionButtonSelected
                  ]}
                  onPress={() => setWordTheme('交通')}
                >
                  <Text style={[
                    styles.optionText,
                    wordTheme === '交通' && styles.optionTextSelected
                  ]}>交通</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(243, 156, 18, 0.9)' }]}
            onPress={() => navigation.navigate('Game', { timeLimit, wordCategory, wordTheme })}
          >
            <Text style={styles.buttonText}>开始游戏</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(52, 152, 219, 0.9)' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>返回</Text>
          </TouchableOpacity>
        </View>
        
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

// 游戏主界面
const GameScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { timeLimit, wordCategory, wordTheme } = route.params;
  const [score, setScore] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(timeLimit);
  const [currentWord, setCurrentWord] = React.useState<string>('');
  const [correctWords, setCorrectWords] = React.useState<string[]>([]);
  const [wrongWords, setWrongWords] = React.useState<string[]>([]);
  const [usedWords, setUsedWords] = React.useState<string[]>([]);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  
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

  // 模拟词库 - 分主题和难度
  // 基础词库 - 简单常见词汇
  const basicDailyWords = ['苹果', '电脑', '手机', '太阳', '月亮', '书本', '铅笔', '眼镜', '手表', '汽车', '篮球', '足球', '水杯', '椅子', '桌子', '电视', '冰箱', '空调', '钥匙', '钱包', '书包', '帽子', '鞋子', '衣服', '裤子', '袜子', '电梯', '水果', '蔬菜', '厨房', '卧室', '客厅', '浴室', '公园', '医院', '学校', '商场', '餐厅', '超市', '银行'];
  
  const basicTechWords = ['手机', '电脑', '平板', '鼠标', '键盘', '耳机', '相机', '打印机', '投影仪', '路由器', '充电器', '数据线', '电池', '硬盘', '内存', '屏幕', '摄像头', '麦克风', '音箱', '扫描仪'];
  
  const basicLiteraryWords = ['书本', '诗歌', '小说', '散文', '日记', '杂志', '报纸', '字典', '故事', '童话', '作者', '书架', '书签', '书店', '图书馆', '文章', '笔记', '标题', '插图', '出版社'];
  
  const basicGeographyWords = ['山', '河', '湖', '海', '岛', '沙漠', '草原', '森林', '高原', '平原', '瀑布', '沙滩', '海洋', '大陆', '地图', '指南针', '地球', '国家', '城市', '首都'];
  
  const basicMovieWords = ['电影', '电视剧', '动画片', '纪录片', '演员', '导演', '编剧', '观众', '票房', '海报', '预告片', '特效', '音乐', '场景', '服装', '道具', '摄影', '奥斯卡', '金马奖', '金鸡奖'];
  
  const basicTransportWords = ['汽车', '自行车', '公交车', '地铁', '火车', '高铁', '飞机', '轮船', '摩托车', '出租车', '电动车', '直升机', '热气球', '滑板', '轮滑', '三轮车', '货车', '游艇', '帆船', '马车'];

  // 进阶词库 - 较复杂或专业词汇
  const advancedDailyWords = ['化妆品', '咖啡机', '洗碗机', '窗帘', '盆栽', '花瓶', '茶几', '装饰画', '红酒', '调料', '蛋糕', '甜点', '健身房', '指甲油', '理发店', '餐巾', '卫生纸', '剃须刀', '洗发水', '沐浴露', '润肤霜', '护手霜', '防晒霜', '面膜', '喷雾', '除湿机', '加湿器', '吸尘器', '榨汁机', '烤箱'];
  
  const advancedTechWords = ['人工智能', '量子计算', '区块链', '虚拟现实', '增强现实', '云计算', '大数据', '物联网', '5G网络', '边缘计算', '机器学习', '深度学习', '神经网络', '自动驾驶', '语音识别', '人脸识别', '生物识别', '自然语言处理', '数据挖掘', '密码学', '算法', '数据库', '服务器', '防火墙', '操作系统', '编程语言', '软件开发', '硬件设计', '芯片制造', '量子芯片'];
  
  const advancedLiteraryWords = ['后现代主义', '存在主义', '意识流', '魔幻现实主义', '黑色幽默', '超现实主义', '象征主义', '浪漫主义', '现实主义', '自然主义', '印象派', '表现主义', '历史小说', '科幻小说', '哲学著作', '戏剧理论', '文学批评', '诗歌创作', '散文随笔', '传记文学', '审美观念', '艺术思潮', '文化现象', '人文精神', '创作灵感', '思想深度', '情感表达', '语言风格', '艺术技巧', '创新精神'];
  
  const advancedGeographyWords = ['地质构造', '板块运动', '大气层', '水文循环', '生态系统', '热带雨林', '寒带苔原', '温带草原', '极地冰盖', '海洋洋流', '气候变化', '全球变暖', '自然保护区', '生物多样性', '珊瑚礁', '火山活动', '地震带', '峡谷地貌', '喀斯特地形', '冰川地貌', '黄土高原', '青藏高原', '亚马逊盆地', '撒哈拉沙漠', '阿尔卑斯山', '喜马拉雅山', '大堡礁', '威尼斯水城', '马尔代夫', '冰岛'];
  
  const advancedMovieWords = ['电影制片人', '剧情设计', '摄影指导', '后期制作', '特效制作', '配乐设计', '剧本创作', '艺术指导', '场景设计', '灯光设计', '服装设计', '化妆设计', '视觉效果', '蒙太奇', '长镜头', '景深控制', '色彩搭配', '表演技巧', '分镜头脚本', '剧情转折', '人物塑造', '情节发展', '悬疑氛围', '戏剧冲突', '主题深度', '社会批判', '艺术风格', '镜头语言', '叙事结构', '电影理论'];
  
  const advancedTransportWords = ['交通枢纽', '轨道交通', '航空港', '深水港口', '环形立交', '隧道工程', '桥梁结构', '智能交通', '交通规划', '无人驾驶', '太空飞船', '潜水艇', '核动力航母', '磁悬浮列车', '高速铁路', '城市轻轨', '海底隧道', '跨海大桥', '空中缆车', '公共自行车', '共享交通', '电动汽车', '太阳能飞机', '氢燃料汽车', '高速公路', '航空管制', '轮船导航', '交通信号', '智能路灯', '交通监控'];

  // 流行语词库
  const popPhrases = ['内卷', '躺平', '绝绝子', '困困', '摆烂', '狠狠熬', '好家伙', '我去', '绝了', '盘它', '永远的神', 
    '打工人', '后浪', '秋天的第一杯奶茶', '自信点，没有人比你更懂', '不要死在沙滩上', '奥利给', '不讲武德', 
    '柠檬精', '杠精', '土味情话', '佛系', '脱口秀', '硬核', '真香', '尬聊', '尊嘟假嘟', '花里胡哨', 
    '人类高质量男性', '王炸', '我太难了', '操作', '凉凉', '小冰棍', '笑死', '嘎嘎猛', '高端局', '装傻充愣', 
    '社恐', '整活', '破防', '上头', '可达鸭', '梦回', '干饭人', '爷青回', '夺笋啊', '咱就是说', '一整个XX', 
    '谁不想要', '啥也不是', '老八秘制小汉堡', '手动狗头', '好事成双', '这次一定', '鲨了我', '爱恨交织', 
    '飞鹰走狗', '猫十三', '乱杀', '没有输出', '哈哈哈哈哈', '年轻人不讲武德', '我不要你觉得我要我觉得', 
    '一下午来了好多小姐姐', '扎心了老铁', '杀疯了', '带好穿脱', '年轻人的第一件', '斯哈斯哈', '不愧是你', 
    '燃起来了', '麻了', '冲塔', '哭戏绝了', '是个狠人', '不明真相的吃瓜群众', '你礼貌吗', '无中生有', 
    '疯狂星期四', '爷关起来了', '我心态崩了', '懂不懂沉梦辰的含金量', '妹妹的定义是'];

  // 网络梗词库
  const internetMemes = ['二次元', '鬼畜', '单推', '神仙打架', '打码', '弹幕', '表情包', '钓鱼执法', '沙雕图', 
    '厉害了我的哥', '吃瓜群众', '你币有了', '亲王', '沙雕', '退退退', '毒唯', '吃了没', '爱国铁子', 
    '多喝热水', '打工人', '拔草', '种草', '直播带货', 'CP', '嗑CP', '混剪', '哔哩哔哩', '牛蛙', '空瓶记', 
    '甜豆腐脑', '咸豆腐脑', '打咩', '凡尔赛文学', '淡黄的长裙', '米线', '喝奶茶', '泰裤辣', '雪糕刺客', 
    '亏钱呢', '反向巧克力', '麦乐鸡', '汉堡', '薯条', '肯德基', '麦当劳', '穿青蛙', '呱呱呱', '无人问津', 
    '阿姨看得都想流泪', '电子烟', '香烟', '奶茶', '星巴克', '好奇害死猫', '闷声大发财', '坐等打脸', 
    '大猛子', '夺笋啊', '搞什么飞机', '高端局', '乍一看', '鸡你太美', '鼓掌', '社死', '难受', '两眼一黑', 
    '我是懂哥', '笑死', '来个亲亲', '来个摸摸', '来个抱抱', '生气', '给你一拳', '加个空调', '很合理', 
    '手动狗头', '有一说一', '确实', '给大佬倒茶', '整活', '好家伙', '捏麻麻', '啥也不是', '被背刺', 
    '精准打击', '你忘了', '恰包', '恰饭', '润了', '月入两千', '月入十万', '寄', '塔宁', '太马了', 
    '油饼食不食', '直播雷击', '精神支柱', '晚安', '全乱了', '懂了', '我懂', '你懂'];

  // 游戏初始化 - 只执行一次
  React.useEffect(() => {
    console.log("游戏初始化", {wordCategory, wordTheme});
    
    // 初始化词库
    let words: string[] = [];
    
    // 根据词库难度和主题选择词库
    if (wordTheme === '全部') {
      // 按难度选择所有主题词库
      if (wordCategory === '基础') {
        words = [...basicDailyWords, ...basicTechWords, ...basicLiteraryWords, ...basicGeographyWords, ...basicMovieWords, ...basicTransportWords];
      } else if (wordCategory === '进阶') {
        words = [...advancedDailyWords, ...advancedTechWords, ...advancedLiteraryWords, ...advancedGeographyWords, ...advancedMovieWords, ...advancedTransportWords];
      } else {
        // 随机难度包含所有词库
        words = [...basicDailyWords, ...basicTechWords, ...basicLiteraryWords, ...basicGeographyWords, ...basicMovieWords, ...basicTransportWords,
                ...advancedDailyWords, ...advancedTechWords, ...advancedLiteraryWords, ...advancedGeographyWords, ...advancedMovieWords, ...advancedTransportWords,
                ...popPhrases, ...internetMemes];
      }
    } else {
      // 按主题选择词库
      if (wordTheme === '日常') {
        words = wordCategory === '基础' ? basicDailyWords : 
                wordCategory === '进阶' ? advancedDailyWords : 
                [...basicDailyWords, ...advancedDailyWords];
      } else if (wordTheme === '科技') {
        words = wordCategory === '基础' ? basicTechWords : 
                wordCategory === '进阶' ? advancedTechWords : 
                [...basicTechWords, ...advancedTechWords];
      } else if (wordTheme === '文学') {
        words = wordCategory === '基础' ? basicLiteraryWords : 
                wordCategory === '进阶' ? advancedLiteraryWords : 
                [...basicLiteraryWords, ...advancedLiteraryWords];
      } else if (wordTheme === '地理') {
        words = wordCategory === '基础' ? basicGeographyWords : 
                wordCategory === '进阶' ? advancedGeographyWords : 
                [...basicGeographyWords, ...advancedGeographyWords];
      } else if (wordTheme === '影视') {
        words = wordCategory === '基础' ? basicMovieWords : 
                wordCategory === '进阶' ? advancedMovieWords : 
                [...basicMovieWords, ...advancedMovieWords];
      } else if (wordTheme === '交通') {
        words = wordCategory === '基础' ? basicTransportWords : 
                wordCategory === '进阶' ? advancedTransportWords : 
                [...basicTransportWords, ...advancedTransportWords];
      } else if (wordTheme === '流行语') {
        words = popPhrases;
      } else if (wordTheme === '网络梗') {
        words = internetMemes;
      }
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
    if (!isGameStarted || isGameOver || isPaused) {
      console.log("计时器条件不满足", {isGameStarted, isGameOver, isPaused});
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
  }, [isGameStarted, isGameOver, isPaused]);
  
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
      navigationRef.current.reset({
        index: 0,
        routes: [
          { name: 'Result', params: { score, correctWords, wrongWords } }
        ],
      });
    }, 300); // 增加延迟确保状态更新完成
  }, []);
  
  // 切换暂停状态
  const togglePause = () => {
    setIsPaused(prevState => !prevState);
  };

  // 直接退出到结果页面
  const exitToResultScreen = () => {
    // 清理计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 标记游戏结束
    setIsGameOver(true);
    
    // 使用当前数据导航到结果页面
    const { score, correctWords, wrongWords } = gameDataRef.current;
    
    // 重置导航堆栈，导航到结果页面
    navigationRef.current.reset({
      index: 0,
      routes: [
        { 
          name: 'Result', 
          params: { 
            score, 
            correctWords, 
            wrongWords,
            fromEarlyExit: true 
          } 
        }
      ],
    });
  };
  
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
    <LinearGradient
      colors={['#8A2BE2', '#4169E1']} // 从紫色到蓝色的渐变
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.safeAreaContainer, { paddingTop: insets.top }]}>
        <View style={styles.gameHeaderContainer}>
          <View style={styles.gameHeader}>
            <Text style={[styles.timerText, currentTime <= 10 && styles.timerWarning]}>
              {currentTime}
            </Text>
            <Text style={styles.scoreText}>得分: {score}</Text>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={togglePause}
            >
              <Text style={styles.pauseButtonText}>{isPaused ? "继续" : "暂停"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {isPaused ? (
          <View style={styles.pauseMenu}>
            <Text style={styles.pauseTitle}>游戏暂停</Text>
            <TouchableOpacity
              style={[styles.pauseMenuButton, {backgroundColor: 'rgba(46, 204, 113, 0.9)'}]}
              onPress={togglePause}
            >
              <Text style={styles.pauseMenuButtonText}>继续游戏</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pauseMenuButton, {backgroundColor: 'rgba(231, 76, 60, 0.9)'}]}
              onPress={exitToResultScreen}
            >
              <Text style={styles.pauseMenuButtonText}>结束游戏</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.wordContainer}>
              <View style={styles.wordCard}>
                <Text style={styles.wordText}>{currentWord}</Text>
              </View>
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
          </>
        )}
        
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

// 结果页面
const ResultScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  // 安全地从路由参数获取数据
  const params = route.params || {};
  const score = params.score || 0;
  const correctWords = Array.isArray(params.correctWords) ? params.correctWords : [];
  const wrongWords = Array.isArray(params.wrongWords) ? params.wrongWords : [];
  const fromEarlyExit = params.fromEarlyExit || false;
  
  // 玩家名字状态
  const [playerName, setPlayerName] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedToLeaderboard, setSavedToLeaderboard] = React.useState(false);
  
  // 调试信息
  console.log("结果页面收到数据:", { score, correctWords, wrongWords, fromEarlyExit });

  // 重置导航到设置页面（再玩一次）
  const playAgain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Settings' }],
    });
  };
  
  // 重置导航到主界面
  const backToMainMenu = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };
  
  // 导航到排行榜页面
  const viewLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };
  
  // 保存分数到排行榜
  const saveScore = () => {
    if (!playerName.trim()) {
      Alert.alert('请输入名字', '请输入您的名字以保存成绩');
      return;
    }
    
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      // 创建新记录
      const newRecord: LeaderboardRecord = {
        name: playerName.trim(),
        score: score,
        date: new Date().toISOString(),
        words: correctWords.length
      };
      
      // 添加新记录到全局变量
      globalLeaderboard.push(newRecord);
      
      // 按分数排序（从高到低）
      globalLeaderboard.sort((a, b) => b.score - a.score);
      
      // 只保留前10名
      if (globalLeaderboard.length > 10) {
        globalLeaderboard.splice(10);
      }
      
      setSavedToLeaderboard(true);
      Alert.alert('保存成功', '您的分数已成功保存到排行榜！');
    } catch (error) {
      console.error('保存分数时出错:', error);
      Alert.alert('保存失败', '保存分数时发生错误，请稍后再试');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <LinearGradient
      colors={['#8A2BE2', '#4169E1']} // 从紫色到蓝色的渐变
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.safeAreaContainer, { paddingTop: insets.top }]}>
        <Text style={styles.pageTitle}>游戏结束</Text>
        <Text style={styles.resultScoreLabel}>最终得分</Text>
        <Text style={styles.resultScore}>{score}</Text>
        
        {!savedToLeaderboard && (
          <View style={styles.nameInputContainer}>
            <Text style={styles.nameInputLabel}>输入您的名字保存成绩：</Text>
            <TextInput
              style={styles.nameInput}
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="请输入名字"
              maxLength={10}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'rgba(39, 174, 96, 0.9)', width: '80%' }]}
              onPress={saveScore}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>保存成绩</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        
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
            style={[styles.button, { backgroundColor: 'rgba(243, 156, 18, 0.9)', width: '80%' }]}
            onPress={playAgain}
          >
            <Text style={styles.buttonText}>再玩一次</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(52, 152, 219, 0.9)', width: '80%' }]}
            onPress={backToMainMenu}
          >
            <Text style={styles.buttonText}>返回主菜单</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'rgba(155, 89, 182, 0.9)', width: '80%' }]}
            onPress={viewLeaderboard}
          >
            <Text style={styles.buttonText}>查看排行榜</Text>
          </TouchableOpacity>
        </View>
        
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

// 排行榜页面
const LeaderboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  // 本地和在线排行榜数据
  const [localLeaderboard, setLocalLeaderboard] = React.useState<LeaderboardRecord[]>([]);
  const [onlineLeaderboard, setOnlineLeaderboard] = React.useState<LeaderboardRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showOnline, setShowOnline] = React.useState(false);
  
  // 加载排行榜数据
  React.useEffect(() => {
    const loadLeaderboards = async () => {
      try {
        // 使用全局变量中的排行榜数据
        setLocalLeaderboard([...globalLeaderboard]);
        
        // 模拟数据
        const fakeOnlineData: LeaderboardRecord[] = [
          { name: '玩家A', score: 28, date: new Date().toISOString(), words: 28 },
          { name: '玩家B', score: 25, date: new Date().toISOString(), words: 25 },
          { name: '玩家C', score: 22, date: new Date().toISOString(), words: 22 },
          { name: '玩家D', score: 20, date: new Date().toISOString(), words: 20 },
          { name: '玩家E', score: 18, date: new Date().toISOString(), words: 18 },
        ];
        setOnlineLeaderboard(fakeOnlineData);
      } catch (error) {
        console.error('加载排行榜数据出错:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLeaderboards();
  }, []);
  
  // 切换排行榜显示
  const toggleLeaderboard = () => {
    setShowOnline(!showOnline);
  };
  
  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  return (
    <LinearGradient
      colors={['#8A2BE2', '#4169E1']} // 从紫色到蓝色的渐变
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={[styles.safeAreaContainer, { paddingTop: insets.top }]}>
        <Text style={styles.pageTitle}>排行榜</Text>
        
        <View style={styles.leaderboardToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton, 
              !showOnline && styles.toggleButtonActive
            ]}
            onPress={() => setShowOnline(false)}
          >
            <Text style={[
              styles.toggleButtonText,
              !showOnline && styles.toggleButtonTextActive
            ]}>本地排行</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton, 
              showOnline && styles.toggleButtonActive
            ]}
            onPress={() => setShowOnline(true)}
          >
            <Text style={[
              styles.toggleButtonText,
              showOnline && styles.toggleButtonTextActive
            ]}>在线排行</Text>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{marginVertical: 30}} />
        ) : (
          <View style={styles.contentCard}>
            <View style={styles.leaderboardHeader}>
              <Text style={[styles.leaderboardHeaderText, { flex: 0.2 }]}>排名</Text>
              <Text style={[styles.leaderboardHeaderText, { flex: 0.35 }]}>玩家</Text>
              <Text style={[styles.leaderboardHeaderText, { flex: 0.25 }]}>分数</Text>
              <Text style={[styles.leaderboardHeaderText, { flex: 0.2 }]}>时间</Text>
            </View>
            
            <ScrollView style={styles.leaderboardList}>
              {(showOnline ? onlineLeaderboard : localLeaderboard).length > 0 ? (
                (showOnline ? onlineLeaderboard : localLeaderboard).map((record, index) => (
                  <View key={index} style={styles.leaderboardItem}>
                    <Text style={[styles.leaderboardItemText, { flex: 0.2 }]}>{index + 1}</Text>
                    <Text style={[styles.leaderboardItemText, { flex: 0.35 }]} numberOfLines={1} ellipsizeMode="tail">{record.name}</Text>
                    <Text style={[styles.leaderboardItemText, { flex: 0.25 }]}>{record.score}</Text>
                    <Text style={[styles.leaderboardItemText, { flex: 0.2, fontSize: 12 }]}>{formatDate(record.date)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyLeaderboardText}>暂无排行数据</Text>
              )}
            </ScrollView>
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'rgba(52, 152, 219, 0.9)', width: '80%' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>返回</Text>
        </TouchableOpacity>
        
        <StatusBar style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
};

// 创建导航堆栈
const Stack = createStackNavigator();

// 主应用组件
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            gestureEnabled: false, // 禁用手势返回功能，避免导航问题
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Rules" component={RulesScreen} options={{ gestureEnabled: true }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ gestureEnabled: true }} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// 样式
const styles = StyleSheet.create({
  // 渐变背景容器
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // 主标题
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  // 副标题
  subtitle: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 50,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // 页面标题（非主页）
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // 内容卡片
  contentCard: {
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  // 按钮容器
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  // 按钮样式
  button: {
    width: '70%',
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // 按钮文字
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 规则文本
  ruleText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 15,
    lineHeight: 24,
  },
  // 设置部分
  settingSection: {
    width: '100%',
    marginBottom: 25,
  },
  // 设置标题
  settingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  // 选项行
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  // 选项按钮
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // 选中的选项按钮
  optionButtonSelected: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    borderColor: '#ffffff',
  },
  // 选项文字
  optionText: {
    fontSize: 16,
    color: '#ffffff',
  },
  // 选中的选项文字
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  // 主题滚动视图
  themeScrollView: {
    width: '100%',
    marginBottom: 10,
  },
  // 主题选项行
  themeOptionsRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  // 游戏容器相关样式
  gameHeaderContainer: {
    width: '100%',
    paddingTop: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    marginHorizontal: 10,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timerWarning: {
    color: '#e74c3c',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pauseButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pauseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pauseMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pauseTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  pauseMenuButton: {
    width: '100%',
    padding: 15,
    borderRadius: 30,
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
  pauseMenuButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  wordCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 30,
    minWidth: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    height: 120,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  correctButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
  },
  skipButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
  },
  actionText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  // 排行榜样式
  leaderboardToggle: {
    flexDirection: 'row',
    width: '95%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    opacity: 0.7,
  },
  toggleButtonTextActive: {
    color: '#ffffff',
    opacity: 1,
    fontWeight: '700',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(52, 152, 219, 0.5)',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  leaderboardHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  leaderboardItemText: {
    fontSize: 16,
    color: '#ffffff',
  },
  emptyLeaderboardText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  // 名称输入
  nameInputContainer: {
    width: '95%',
    marginBottom: 15,
    alignItems: 'center',
  },
  nameInputLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  nameInput: {
    width: '80%',
    height: 45,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
  },
  wordsListContainer: {
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 15,
    flex: 1,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  wordsSection: {
    marginBottom: 20,
  },
  wordsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  wordsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  wordItemText: {
    fontSize: 18,
    color: '#ffffff',
  },
  correctMark: {
    color: '#2ecc71',
    fontSize: 20,
    fontWeight: 'bold',
  },
  skipMark: {
    color: '#e74c3c',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyListText: {
    padding: 10,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  // 结果页面样式
  resultScoreLabel: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 5,
    opacity: 0.9,
  },
  resultScore: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  // 安全区域容器
  safeAreaContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
