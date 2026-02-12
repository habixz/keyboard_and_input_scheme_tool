var char_pinyin = {}; //空 结构体：拼音

var schemes = { // 结构体：方案
  '小鹤':'Q=iu,W=ei,R=uan er,T=ue ve,Y=un,U=sh,I=ch,O=uo,P=ie,S=ong iong,D=ai,F=en,G=eng,H=ang,J=an,K=ing uai,L=iang uang,Z=ou,X=ia ua,C=ao,V=zh ui,B=in,N=iao,M=ian',

  '双拼':'Q=iu,W=ei,E=er,R=uan,T=ue ve,Y=un,U=sh,I=ch,O=ou,P=ie,A=,S=ong iong,D=ai,F=en eng,G=ui,H=ang,J=an,K=uai,L=iang uang,FH=,Z=uo,X=ia ua,C=ao,V=zh,B=in ing,N=iao,M=ian,DH=,JH=,CH=',

  empty:'Q=,W=,E=,R=,T=,Y=,U=,I=,O=,P=,A=,S=,D=,F=,G=,H=,J=,K=,L=,FH=,Z=,X=,C=,V=,B=,N=,M=,DH=,JH=,CH=',
  '声母模式':'Q=,W=,E=,R=,T=,Y=,U=,I=,O=,P=,A=,S=,D=,F=,G=,H=,J=,K=,L=,FH=,Z=,X=,C=,V=,B=,N=,M=,DH=,JH=,CH=',
  '全拼/英文':'Q=,W=,E=,R=,T=,Y=,U=,I=,O=,P=,A=,S=,D=,F=,G=,H=,J=,K=,L=,FH=,Z=,X=,C=,V=,B=,N=,M=,DH=,JH=,CH='
};

// 所有方案的评估结果
var results = {}; // 空 结构体：结果

var keyboard_layouts = { // 结构体：键盘布局
qwerty : {
           'q':[0,0], 'w':[1,0], 'e':[2,0], 'r':[3,0], 't':[4,0],
           'y':[5,0], 'u':[6,0], 'i':[7,0], 'o':[8,0], 'p':[9,0],
           'a':[0,1], 's':[1,1], 'd':[2,1], 'f':[3,1], 'g':[4,1],
           'h':[5,1], 'j':[6,1], 'k':[7,1], 'l':[8,1], ';':[9,1],
           'z':[0,2], 'x':[1,2], 'c':[2,2], 'v':[3,2], 'b':[4,2],
           'n':[5,2], 'm':[6,2], ',':[7,2], '.':[8,2], '/':[9,2],
         },
dvorak : {
           '/':[0,0], ',':[1,0], '.':[2,0], 'p':[3,0], 'y':[4,0],
           'f':[5,0], 'g':[6,0], 'c':[7,0], 'r':[8,0], 'l':[9,0],
           'a':[0,1], 'o':[1,1], 'e':[2,1], 'u':[3,1], 'i':[4,1],
           'd':[5,1], 'h':[6,1], 't':[7,1], 'n':[8,1], 's':[9,1],
           ';':[0,2], 'q':[1,2], 'j':[2,2], 'k':[3,2], 'x':[4,2],
           'b':[5,2], 'm':[6,2], 'w':[7,2], 'v':[8,2], 'z':[9,2],
         },
colemak : {
            'q':[0,0], 'w':[1,0], 'f':[2,0], 'p':[3,0], 'g':[4,0],
            'j':[5,0], 'l':[6,0], 'u':[7,0], 'y':[8,0], ';':[9,0],
            'a':[0,1], 'r':[1,1], 's':[2,1], 't':[3,1], 'd':[4,1],
            'h':[5,1], 'n':[6,1], 'e':[7,1], 'i':[8,1], 'o':[9,1],
            'z':[0,2], 'x':[1,2], 'c':[2,2], 'v':[3,2], 'b':[4,2],
            'k':[5,2], 'm':[6,2], ',':[7,2], '.':[8,2], '/':[9,2],
          },
workman : {
            'q':[0,0], 'd':[1,0], 'r':[2,0], 'w':[3,0], 'b':[4,0],
            'j':[5,0], 'f':[6,0], 'u':[7,0], 'p':[8,0], ';':[9,0],
            'a':[0,1], 's':[1,1], 'h':[2,1], 't':[3,1], 'g':[4,1],
            'y':[5,1], 'n':[6,1], 'e':[7,1], 'o':[8,1], 'i':[9,1],
            'z':[0,2], 'x':[1,2], 'm':[2,2], 'c':[3,2], 'v':[4,2],
            'k':[5,2], 'l':[6,2], ',':[7,2], '.':[8,2], '/':[9,2],
          },
}

// 将列分配给手指
//                   0  1  2  3  4  5  6  7  8  9
var column_finger = [0, 1, 2, 3, 3, 6, 6, 7, 8, 9];

// 手指速度，假设 食指的速度为 1

//                        小   无名    中    食   拇 || 拇   食   中    无名   小
//                        0     1     2     3    4 || 5    6    7     8     9
var finger_speed_up   = [0.60, 0.75, 0.80, 0.75, 1.0, 1.0, 0.75, 0.80, 0.75, 0.60]; // 手指上行移动
var finger_speed      = [0.85, 0.90, 0.95, 1.00, 1.0, 1.0, 1.00, 0.95, 0.90, 0.85];
var finger_speed_down = [0.65, 0.70, 0.75, 0.80, 1.0, 1.0, 0.80, 0.75, 0.70, 0.65]; // 手指下行移动


var index_speed_upslash=0.725; // 食指上斜向移动
var index_speed_horizon=0.775; // 食指横向移动
var index_speed_downslash=0.55; // 食指下斜向移动







// 按键需要按下的深度
var press_depth = 0.2;

// 将标点符号映射到键
var punctuation_names = {';':'FH', ',':'DH', '.':'JH', '/':'CH', '\'':'YH'}; // 结构体：标点符号名称 // FH 指 分号fenhao
var punctuation_keys = {'FH':';', 'DH':',', 'JH':'.', 'CH':'/', 'YH':'\''}; // 结构体：标点符号键

// 输入文本中的标点符号
var punctuations = { // 结构体：标点符号
    '，':',', '。':'.', '；':';', ',':',', '.':'.', ';':';', '/':'/' // 把 中文标点 换成 英文标点
};

var letters = 'abcdefghijklmnopqrstuvwxyz'; // 字符串变量，储存字母
var vowel_keys = 'aoeiuv';
var zero_sheng_fallback_letters = 'aoe';
var no_swap_keys = '';
var locked_keys = {};

function is_consonant_letter(token) {
  return token.length == 1 && letters.includes(token) && !vowel_keys.includes(token);
}

function is_no_swap_key(key) {
  return no_swap_keys.includes(key) || locked_keys[key] === true;
}

function toggle_key_lock(key) {
  if (key == null || key == '') {
    return;
  }
  locked_keys[key] = !(locked_keys[key] === true);
  if (swap_selected_key != null && String(swap_selected_key) == String(key)) {
    clear_swap_selection();
  }
  refresh_lock_ui();
}

function get_locked_keys_snapshot() {
  var out = [];
  for (var k in locked_keys) {
    if (locked_keys[k] === true) {
      out.push(k);
    }
  }
  out.sort();
  return out;
}

function is_vowel_token(token) {
  return token.length == 1 && vowel_keys.includes(token);
}

function is_sheng_token(token) {
  return token == '0' || token == 'zh' || token == 'ch' || token == 'sh' || is_consonant_letter(token);
}

function split_yun_value(value) {
  var vowels = [];
  var others = [];
  var parts = (value || '').split(' ');
  for (var i = 0; i < parts.length; ++i) {
    var t = parts[i].trim().toLowerCase();
    if (t == '') {
      continue;
    }
    if (is_vowel_token(t)) {
      vowels.push(t);
    } else {
      others.push(t);
    }
  }
  return {vowels: vowels, others: others};
}

function join_tokens(tokens) {
  return (tokens || []).join(' ').trim();
}

function split_tokens_by_type(value) {
  var sheng_tokens = [];
  var yun_tokens = [];
  var tokens = (value || '').split(' ');
  for (var i = 0; i < tokens.length; ++i) {
    var t = tokens[i].trim().toLowerCase();
    if (t == '') {
      continue;
    }
    if (is_sheng_token(t)) {
      sheng_tokens.push(t);
    } else {
      yun_tokens.push(t);
    }
  }
  return {sheng: sheng_tokens.join(' '), yun: yun_tokens.join(' ')};
}

function fill_default_shengmu(include_yun) {
  if (include_yun === undefined) {
    include_yun = true;
  }
  var layout = get_layout();
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];

    if (is_consonant_letter(key)) {
      var id = 'sm_' + y + x;
      var existing = document.getElementById(id).value.trim();
      if (existing == '') {
        document.getElementById(id).value = key;
      }
    }

    if (include_yun && vowel_keys.includes(key)) {
      var yun = document.getElementById('py_' + y + x);
      if (yun != null && yun.value.trim() == '') {
        yun.value = key;
      }
    }
  }
}

function ensure_vowel_tokens_in_yun_fields() {
  var layout = get_layout();
  var all_tokens = {};
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];
    var yun = document.getElementById('py_' + y + x);
    if (yun == null) {
      continue;
    }
    var parts = yun.value.split(' ');
    for (var i = 0; i < parts.length; ++i) {
      var t = parts[i].trim().toLowerCase();
      if (t != '') {
        all_tokens[t] = true;
      }
    }
  }

  for (var i = 0; i < vowel_keys.length; ++i) {
    var vowel = vowel_keys[i];
    if (all_tokens[vowel]) {
      continue;
    }
    if (layout[vowel] == null) {
      continue;
    }
    var x = layout[vowel][0];
    var y = layout[vowel][1];
    var yun = document.getElementById('py_' + y + x);
    if (yun == null) {
      continue;
    }
    var value = yun.value.trim();
    yun.value = (value == '') ? vowel : (vowel + ' ' + value);
    all_tokens[vowel] = true;
  }
}

function get_symbol_tag_for_key(key) {
  var layout = get_layout();
  if (layout[key] == null) {
    return '';
  }
  var x = layout[key][0];
  var y = layout[key][1];
  var sm = document.getElementById('sm_' + y + x);
  if (sm == null) {
    return '';
  }
  return sm.dataset.symbolTag || '';
}

function set_symbol_tag_for_key(key, tag) {
  var layout = get_layout();
  if (layout[key] == null) {
    return;
  }
  var x = layout[key][0];
  var y = layout[key][1];
  var sm = document.getElementById('sm_' + y + x);
  var py = document.getElementById('py_' + y + x);
  if (sm != null) {
    sm.dataset.symbolTag = tag;
    sm.placeholder = tag;
  }
  if (py != null) {
    py.dataset.symbolTag = tag;
    py.placeholder = tag;
  }
}

function swap_symbol_tags(key1, key2) {
  var t1 = get_symbol_tag_for_key(key1);
  var t2 = get_symbol_tag_for_key(key2);
  set_symbol_tag_for_key(key1, t2);
  set_symbol_tag_for_key(key2, t1);
}

function reset_symbol_tags_to_physical_keys() {
  var layout = get_layout();
  for (var key in layout) {
    var tag = letters.includes(key) ? '' : key;
    set_symbol_tag_for_key(key, tag);
  }
}

function update_symbol_placeholders() {
  var layout = get_layout();
  for (var key in layout) {
    var tag = get_symbol_tag_for_key(key);
    set_symbol_tag_for_key(key, tag);
  }
}

function find_key_by_symbol_tag(symbol_tag) {
  var layout = get_layout();
  for (var key in layout) {
    if (get_symbol_tag_for_key(key) == symbol_tag) {
      return key;
    }
  }
  return null;
}

function find_key_by_symbol_tag_in_tags(symbol_tag, symbol_tags) {
  var layout = get_layout();
  for (var key in layout) {
    if (String(symbol_tags[key] || '') == String(symbol_tag)) {
      return key;
    }
  }
  return null;
}

function split_pinyin(pinyin) { // 分离拼音
  if (pinyin == 'ng') { // 如果传入的拼音是 ng ，改成 eng
    pinyin = 'eng';
  }

  var first = pinyin[0]; // 定义 一个 变量：第一，得到 拼音的第一个字符

  var sheng, yun; // 定义 变量 声、韵母

  if ('aoe'.includes(first)) { // 这里意为 零声母，如 ai,ao,er
    sheng = '';
    yun = pinyin;
  }
  else if ('zcs'.includes(first) && pinyin[1] == 'h') { // 如果是 zh，ch，sh
    sheng = pinyin.substr(0, 2); // 声母 为前两个
    yun = pinyin.substr(2); // 韵母 为后面的
  }
  else { // 除了上面的情况外，其他是正常情况
    sheng = pinyin.substr(0, 1);
    yun = pinyin.substr(1);
  }

  return {sheng: sheng, yun: yun};//后面是上面创建的,前面是在return里为创建了 一个匿名结构体的属性,当这个函数赋值给一个变量时，这两个属性就成了那个变量的
}

function adjust_sheng_for_stats(sheng, yun, has_zero_sheng) {
  if (sheng == '' && !has_zero_sheng) {
    return yun[0];
  }
  return sheng;
}

var sheng_yun_freq = {}; // 空 结构体： 声、韵 频率
var yun_sheng_freq = {};
var sheng_sheng_freq = {};

function update_sheng_yun_freq(sheng, yun) { // 更新频率
  if (sheng_yun_freq[sheng] == null) {
    sheng_yun_freq[sheng] = {}
  }
  if (sheng_yun_freq[sheng][yun] == null) {
    sheng_yun_freq[sheng][yun] = 1;
  } else {
    ++sheng_yun_freq[sheng][yun];
  }
}

function update_yun_sheng_freq(yun, sheng) {
  if (yun == '') {
    return;
  }
  if (yun_sheng_freq[yun] == null) {
    yun_sheng_freq[yun] = {}
  }
  if (yun_sheng_freq[yun][sheng] == null) {
    yun_sheng_freq[yun][sheng] = 1;
  } else {
    ++yun_sheng_freq[yun][sheng];
  }
}

function update_sheng_sheng_freq(first, second) {
  if (first == '' || second == '') {
    return;
  }
  if (sheng_sheng_freq[first] == null) {
    sheng_sheng_freq[first] = {};
  }
  if (sheng_sheng_freq[first][second] == null) {
    sheng_sheng_freq[first][second] = 1;
  } else {
    ++sheng_sheng_freq[first][second];
  }
}

var alphabeta_freq = {} // 空 结构体：字母频率

function update_alphabeta_freq(char) {
  if (alphabeta_freq[char] == null) {
    alphabeta_freq[char] = 1;
  } else {
    ++alphabeta_freq[char];
  }
}

function stat_pinyin() { // 统计拼音
  var input = document.getElementById('input-text').value;
  var pinyin_freq = {};
  var sheng_freq = {};
  var yun_freq = {};
  var pinyin_splits = {};
  var total = 0;
  var letter_total = 0;
  var symbol_total = 0;
  var letter_freq = {};
  var symbol_freq = {};

  var scheme = get_scheme_from_keyboard();
  var pinyin_map = read_pinyin_map_from_scheme(scheme).pinyin_map;
  var has_zero_sheng = (pinyin_map['0'] != null);

  var last_yun = '';
  var last_sheng = '';
  sheng_yun_freq = {};
  yun_sheng_freq = {};
  sheng_sheng_freq = {};
  alphabeta_freq = {};

  for (var i = 0; i < input.length; ++i) {
    var c = input[i].trim();
    if (c == '') {
      continue;
    }
    var punctuation = punctuations[c];
    if (punctuation != null) {
      ++symbol_total;
      if (symbol_freq[punctuation] == null) {
        symbol_freq[punctuation] = 1;
      } else {
        ++symbol_freq[punctuation];
      }
      update_yun_sheng_freq(last_yun, punctuation);
      last_yun = punctuation;
      continue;
    }
    var lower = c.toLowerCase();
    if (letters.includes(lower)) {
      ++letter_total;
      if (letter_freq[lower] == null) {
        letter_freq[lower] = 1;
      } else {
        ++letter_freq[lower];
      }
      continue;
    }
    if ('1234567890'.includes(c)) {
      ++symbol_total;
      if (symbol_freq[c] == null) {
        symbol_freq[c] = 1;
      } else {
        ++symbol_freq[c];
      }
      continue;
    }
    var pinyin = char_pinyin[c];
    if (pinyin == null) {
      continue;
    }
    var sheng_yun = pinyin_splits[pinyin];
    if (sheng_yun == null) {
      sheng_yun = split_pinyin(pinyin);
      pinyin_splits[pinyin] = sheng_yun;
    }

    var sheng = sheng_yun.sheng;
    var yun = sheng_yun.yun;
    sheng = adjust_sheng_for_stats(sheng, yun, has_zero_sheng);

    ++total;
    if (pinyin_freq[pinyin] == null) {
      pinyin_freq[pinyin] = 1;
    } else {
      ++pinyin_freq[pinyin];
    }
    if (sheng_freq[sheng] == null) {
      sheng_freq[sheng] = 1;
    } else {
      ++sheng_freq[sheng];
    }
    if (yun_freq[yun] == null) {
      yun_freq[yun] = 1;
    } else {
      ++yun_freq[yun];
    }

    update_sheng_yun_freq(sheng, yun);
    update_yun_sheng_freq(last_yun, sheng);
    last_yun = yun;

    update_sheng_sheng_freq(last_sheng, sheng);
    last_sheng = sheng;
  }
  save_pinyin_stats('pinyin', pinyin_freq, total);
  save_pinyin_stats('sheng', sheng_freq, total);
  save_pinyin_stats('yun', yun_freq, total);
  save_pinyin_stats('letter', letter_freq, letter_total);
  save_pinyin_stats('alphabet', symbol_freq, symbol_total);
  show_pinyin_stats('pinyin');
  show_pinyin_stats('sheng');
  show_pinyin_stats('yun');
  show_pinyin_stats('letter');
  show_pinyin_stats('alphabet');
}

function save_pinyin_stats(type, freq, total) {
  var keys = Object.keys(freq);
  keys.sort(function(a, b) { return freq[b] - freq[a]; });
  var stats = '';
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var display_key = key;
    if (type == 'sheng' && key == '') {
      display_key = '0';
    }
    stats += pad(display_key, 6) + ' ' + percent_str(freq[key], total, 2) + '\n';
  }
  set_inner_html(type + '-stats-saved', stats);
}

function show_pinyin_stats(type) {
  var filter = document.getElementById(type + '-stats-filter').value;
  var lines = document.getElementById(type + '-stats-saved').innerHTML.split('\n');
  var stats = '';
  for (var i = 0; i < lines.length; ++i) {
    if (filter == '' || lines[i].match(filter)) {
      stats += lines[i] + '\n';
    }
  }
  set_inner_html(type + '-stats', stats);
  show_element(type + '-stats-cell');
}

function set_default_text_status(msg) {
  var el = document.getElementById('default-text-status');
  if (el == null) {
    return;
  }
  set_inner_html('default-text-status', msg || '');
}

function load_default_input_text() {
  var input = document.getElementById('input-text');
  if (input == null) {
    return;
  }
  var built_in_default = '';
  var existing = input.value.replace(/\r\n/g, '\n').trim();
  var looks_like_legacy_default = (existing.indexOf('1.') == 0) &&
    (existing.indexOf('\n2.') != -1) &&
    (existing.indexOf('\n3.') != -1) &&
    (existing.indexOf('\n4.') != -1) &&
    (existing.indexOf('\n5.') != -1) &&
    (existing.indexOf('-、|、/、\\、^') != -1);
  var previous_default = null;
  try {
    previous_default = localStorage.getItem('default_input_text') || null;
  } catch (e) {
    previous_default = null;
  }
  var should_replace = (existing == '') ||
    looks_like_legacy_default ||
    (previous_default != null && existing == previous_default.replace(/\r\n/g, '\n').trim());
  if (!should_replace) {
    set_default_text_status('');
    return;
  }
  set_default_text_status('正在从 default_text.txt 读取默认文稿…');
  fetch('default_text.txt?ts=' + Date.now()).then(
    function(resp) {
      if (!resp.ok) {
        throw new Error('http ' + resp.status);
      }
      return resp.text();
    }).then(
      function(text) {
        var value = (text || '').replace(/\r\n/g, '\n').trim();
        if (value == '') {
          input.value = built_in_default;
          try {
            localStorage.removeItem('default_input_text');
          } catch (e) {}
          set_default_text_status('default_text.txt 内容为空，已保持输入框为空。');
          schedule_input_text_count_update();
          return;
        }
        input.value = value;
        try {
          localStorage.setItem('default_input_text', value);
        } catch (e) {}
        set_default_text_status('已从 default_text.txt 加载默认文稿。');
        schedule_input_text_count_update();
      }).catch(
        function(err) {
          input.value = built_in_default;
          try {
            localStorage.removeItem('default_input_text');
          } catch (e) {}
          var tip = '未能读取 default_text.txt（已保持输入框为空）。';
          if (window.location != null && window.location.protocol == 'file:') {
            tip += ' 你当前是 file:// 方式打开，浏览器会阻止读取本地 txt；请用 http://localhost:8000/eval.html 打开。';
          } else if (err != null) {
            tip += ' (' + err + ')';
          }
          set_default_text_status(tip);
          schedule_input_text_count_update();
        });
}

var input_text_count_raf = 0;

function format_count_4(n) {
  var s = String(n == null ? 0 : n);
  if (s.length <= 4) {
    return s;
  }
  var out = '';
  var first = s.length % 4;
  if (first == 0) {
    first = 4;
  }
  out += s.slice(0, first);
  for (var i = first; i < s.length; i += 4) {
    out += ',' + s.slice(i, i + 4);
  }
  return out;
}

function update_input_text_count() {
  var input = document.getElementById('input-text');
  var out = document.getElementById('input-text-count');
  if (input == null || out == null) {
    return;
  }
  var text = String(input.value || '');
  var count = 0;
  for (var i = 0; i < text.length; ++i) {
    var code = text.charCodeAt(i);
    if (code == 9 || code == 10 || code == 13 || code == 32) {
      continue;
    }
    count += 1;
  }
  out.innerHTML = '字数：' + format_count_4(count);
}

function schedule_input_text_count_update() {
  if (input_text_count_raf != 0) {
    return;
  }
  input_text_count_raf = requestAnimationFrame(function() {
    input_text_count_raf = 0;
    update_input_text_count();
  });
}

function bind_input_text_count_update_on_input() {
  var input = document.getElementById('input-text');
  if (input == null) {
    return;
  }
  input.addEventListener('input', schedule_input_text_count_update);
  schedule_input_text_count_update();
}

function initialize_on_load() {
  const url_params = new URLSearchParams(window.location.search);
  if (url_params.get('irrational') != null) {
    show_element('irrational');
  }
  load_default_input_text();
  bind_input_text_count_update_on_input();
  build_char_pinyin_map();
  bind_keycap_refresh_on_input();
  bind_swap_ui();
  init_saved_layouts_ui();
  select_scheme();
}

function build_char_pinyin_map() {
  for (var i = 0; i < char_info.length; ++i) {
    var char = char_info[i][0]; // 汉字
    var pinyin = char_info[i][1]; // 拼音
    // char_info 已经按频率排好序，每个多音字都只取最高频的读音
    if (char_pinyin[char] == null) { // 如果char_pinyin的char 没有拼音，那就赋值
      char_pinyin[char] = pinyin;
    }
  }
}

var last_selected_scheme_name = null;

function build_default_full_pinyin_scheme() {
  var layout = get_layout();
  var scheme = '';
  for (var key in layout) {
    var key_name = key_to_key_name(key);
    var tokens = '';
    if (letters.includes(key)) {
      tokens = key;
    }
    if (scheme != '') {
      scheme += ',';
    }
    scheme += key_name + '=' + tokens;
  }
  return scheme;
}

function ensure_full_pinyin_letters_on_keyboard() {
  var layout = get_layout();
  var present = {};
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];
    var py = document.getElementById('py_' + y + x);
    if (py != null) {
      var parts = String(py.value || '').trim().toLowerCase().split(' ');
      for (var i = 0; i < parts.length; ++i) {
        var t = parts[i].trim();
        if (t.length == 1 && letters.includes(t)) {
          present[t] = true;
        }
      }
    }
    var sm = document.getElementById('sm_' + y + x);
    if (sm != null) {
      sm.value = '';
    }
  }
  for (var i = 0; i < letters.length; ++i) {
    var ch = letters[i];
    if (present[ch]) {
      continue;
    }
    if (layout[ch] == null) {
      continue;
    }
    var x2 = layout[ch][0];
    var y2 = layout[ch][1];
    var py2 = document.getElementById('py_' + y2 + x2);
    if (py2 == null) {
      continue;
    }
    var existing = String(py2.value || '').trim();
    py2.value = (existing == '') ? ch : (existing + ' ' + ch);
  }
}

function select_scheme() { // 选择方案
  clear_swap_selection();
  hide_element('suggestion');
  var scheme_name = document.getElementById('scheme-name').value;
  var prev_scheme_name = last_selected_scheme_name;
  if (prev_scheme_name == null) {
    prev_scheme_name = scheme_name;
  }
  var leaving_sheng_mode = (prev_scheme_name == '声母模式' && scheme_name != '声母模式');
  var sheng_state_to_apply = leaving_sheng_mode ? read_keyboard_state() : null;

  if (scheme_name == '声母模式') {
    if (results[scheme_name] == null || prev_scheme_name != '声母模式') {
      if (results[scheme_name] == null) {
        add_empty_results(scheme_name);
      }
      var st0 = read_keyboard_state();
      var layout0 = get_layout();
      for (var key0 in layout0) {
        st0.py_values[key0] = '';
        st0.symbol_tags[key0] = '';
      }
      results[scheme_name].scheme = get_scheme_from_state(st0);
    }
    show_scheme('empty');
    show_scheme(scheme_name);
    fill_default_shengmu(false);
    var layout = get_layout();
    for (var i = 0; i < zero_sheng_fallback_letters.length; ++i) {
      var k = zero_sheng_fallback_letters[i];
      if (layout[k] == null) {
        continue;
      }
      var x = layout[k][0];
      var y = layout[k][1];
      var sm = document.getElementById('sm_' + y + x);
      if (sm != null && sm.value.trim() == '') {
        sm.value = k;
      }
    }
    show_layout();
    update_symbol_placeholders();
    evaluate_current_scheme();
    last_selected_scheme_name = scheme_name;
    return;
  }

  if (scheme_name == '全拼/英文') {
    if (results[scheme_name] == null || prev_scheme_name != '全拼/英文') {
      if (results[scheme_name] == null) {
        add_empty_results(scheme_name);
      }
      if (results[scheme_name].scheme == null || results[scheme_name].scheme.trim() == '' || results[scheme_name].scheme == schemes[scheme_name]) {
        results[scheme_name].scheme = build_default_full_pinyin_scheme();
      }
    }
    show_scheme('empty');
    show_scheme(scheme_name);
    ensure_full_pinyin_letters_on_keyboard();
    show_layout();
    evaluate_current_scheme();
    last_selected_scheme_name = scheme_name;
    return;
  }

  show_scheme('empty');
  show_scheme(scheme_name);
  fill_default_shengmu(true);
  ensure_vowel_tokens_in_yun_fields();
  reset_symbol_tags_to_physical_keys();
  show_layout();
  if (sheng_state_to_apply != null) {
    var layout2 = get_layout();
    for (var key2 in layout2) {
      var x2 = layout2[key2][0];
      var y2 = layout2[key2][1];
      var sm2 = document.getElementById('sm_' + y2 + x2);
      if (sm2 != null) {
        sm2.value = (sheng_state_to_apply.sm_values[key2] || '');
      }
    }
    show_layout();
    evaluate_current_scheme();
  } else {
    show_results(scheme_name);
  }
  last_selected_scheme_name = scheme_name;
}

function get_layout() { // 获得布局
  var layout_name = document.getElementById('layout-name').value;
  return keyboard_layouts[layout_name];
}

function key_to_key_name(key) { // 标点符号的转换
  if (punctuation_names[key] == null) {
    return key.toUpperCase();
  } else {
    return punctuation_names[key].toUpperCase();
  }
}

function key_name_to_key(name) {
  if (punctuation_keys[name] == null) {
    return name.toLowerCase();
  } else {
    return punctuation_keys[name];
  }
}

function get_preferred_sheng_label(sheng_value) {
  var tokens = [];
  var parts = (sheng_value || '').split(' ');
  for (var i = 0; i < parts.length; ++i) {
    var t = parts[i].trim().toLowerCase();
    if (t != '') {
      tokens.push(t);
    }
  }
  if (tokens.includes('zh')) {
    return 'ZH';
  }
  if (tokens.includes('ch')) {
    return 'CH';
  }
  if (tokens.includes('sh')) {
    return 'SH';
  }
  if (tokens.length > 0) {
    return tokens[0].toUpperCase();
  }
  return '';
}

function get_keycap_label_for_key(key) {
  var layout = get_layout();
  if (layout[key] == null) {
    return '∅';
  }
  var x = layout[key][0];
  var y = layout[key][1];

  var yun_value = document.getElementById('py_' + y + x).value.trim();
  if (yun_value != '') {
    var parts = yun_value.split(' ');
    for (var i = 0; i < parts.length; ++i) {
      var t = parts[i].trim().toLowerCase();
      if (t != '' && is_vowel_token(t)) {
        return t.toUpperCase();
      }
    }
  }

  var sheng_value = document.getElementById('sm_' + y + x).value.trim();
  var sheng_label = get_preferred_sheng_label(sheng_value);
  if (sheng_label != '') {
    return sheng_label;
  }

  if (yun_value != '') {
    return yun_value.split(' ')[0].toUpperCase();
  }

  var symbol_tag = get_symbol_tag_for_key(key);
  if (symbol_tag != '') {
    return symbol_tag.toUpperCase();
  }
  return '∅';
}

function show_layout() {
  var layout = get_layout();
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];
    var sheng_value = document.getElementById('sm_' + y + x).value.trim();
    var sheng_label = get_preferred_sheng_label(sheng_value);
    var yun_value = document.getElementById('py_' + y + x).value.trim();
    var vowel_label = '';
    if (yun_value != '') {
      var parts = yun_value.split(' ');
      for (var i = 0; i < parts.length; ++i) {
        var t = parts[i].trim().toLowerCase();
        if (t != '' && is_vowel_token(t)) {
          vowel_label = t.toUpperCase();
          break;
        }
      }
    }
    var label = vowel_label;
    if (label == '') {
      label = sheng_label;
    }
    if (label == '' && yun_value != '') {
      label = yun_value.split(' ')[0].toUpperCase();
    }
    if (label == '') {
      var symbol_tag = get_symbol_tag_for_key(key);
      if (symbol_tag != '') {
        label = symbol_tag.toUpperCase();
      }
    }
    set_inner_html('key_' + y + x, label == '' ? '&nbsp;' : label);
  }
}

function bind_keycap_refresh_on_input() {
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 10; ++x) {
      var sm = document.getElementById('sm_' + y + x);
      if (sm != null) {
        sm.oninput = show_layout;
      }
      var ym = document.getElementById('py_' + y + x);
      if (ym != null) {
        ym.oninput = show_layout;
      }
    }
  }
}

var swap_selected_key = null;
var swap_selected_mode = null;
var swap_selected_button_id = null;

function get_key_by_xy(x, y) {
  var layout = get_layout();
  for (var key in layout) {
    var c = layout[key];
    if (c[0] == x && c[1] == y) {
      return key;
    }
  }
  return null;
}

function set_keycap_selected_visual(key, selected) {
  var layout = get_layout();
  if (layout[key] == null) {
    return;
  }
  var x = layout[key][0];
  var y = layout[key][1];
  var el = document.getElementById('key_' + y + x);
  if (el == null) {
    return;
  }
  if (selected) {
    el.classList.add('keycap-selected');
  } else {
    el.classList.remove('keycap-selected');
  }
}

function set_button_selected_visual(button_id, selected) {
  if (button_id == null || button_id == '') {
    return;
  }
  var el = document.getElementById(button_id);
  if (el == null) {
    return;
  }
  if (selected) {
    el.classList.add('swap-btn-selected');
  } else {
    el.classList.remove('swap-btn-selected');
  }
}

function update_swap_ui_visual() {
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 10; ++x) {
      var bsm = document.getElementById('swap_sm_' + y + x);
      var bpy = document.getElementById('swap_py_' + y + x);
      var label = document.getElementById('key_' + y + x);

      if (bsm != null) {
        bsm.classList.remove('swap-btn-focus');
        bsm.classList.remove('swap-btn-disabled');
        bsm.classList.remove('swap-btn-hidden');
      }
      if (bpy != null) {
        bpy.classList.remove('swap-btn-focus');
        bpy.classList.remove('swap-btn-disabled');
        bpy.classList.remove('swap-btn-hidden');
      }
      if (label != null) {
        label.classList.remove('keycap-available');
        label.classList.remove('keycap-disabled');
      }

      if (swap_selected_mode == null) {
        continue;
      }

      var key = get_key_by_xy(x, y);
      var candidate = (key != null && !is_no_swap_key(key));

      if (swap_selected_mode == 'sheng') {
        if (bsm != null) {
          bsm.classList.add('swap-btn-focus');
          if (!candidate) {
            bsm.classList.add('swap-btn-disabled');
          }
        }
        if (bpy != null) {
          bpy.classList.add('swap-btn-hidden');
        }
      } else if (swap_selected_mode == 'yun') {
        if (bpy != null) {
          bpy.classList.add('swap-btn-focus');
          if (!candidate) {
            bpy.classList.add('swap-btn-disabled');
          }
        }
        if (bsm != null) {
          bsm.classList.add('swap-btn-hidden');
        }
      } else if (swap_selected_mode == 'both') {
        if (bsm != null) {
          bsm.classList.add('swap-btn-hidden');
        }
        if (bpy != null) {
          bpy.classList.add('swap-btn-hidden');
        }
        if (label != null) {
          if (candidate) {
            label.classList.add('keycap-available');
          } else {
            label.classList.add('keycap-disabled');
          }
        }
      }
    }
  }
}

function clear_swap_selection() {
  if (swap_selected_key != null) {
    set_keycap_selected_visual(swap_selected_key, false);
  }
  if (swap_selected_button_id != null) {
    set_button_selected_visual(swap_selected_button_id, false);
  }
  swap_selected_key = null;
  swap_selected_mode = null;
  swap_selected_button_id = null;
  update_swap_ui_visual();
}

function set_swap_source(key, mode, button_id) {
  clear_swap_selection();
  swap_selected_key = key;
  swap_selected_mode = mode;
  swap_selected_button_id = button_id || null;
  set_keycap_selected_visual(key, true);
  if (swap_selected_button_id != null) {
    set_button_selected_visual(swap_selected_button_id, true);
  }
  update_swap_ui_visual();
}

function on_keycap_clicked(x, y) {
  var key = get_key_by_xy(x, y);
  if (key == null) {
    return;
  }
  if (is_no_swap_key(key)) {
    return;
  }
  if (swap_selected_key == null) {
    set_swap_source(key, 'both', null);
    return;
  }
  if (swap_selected_mode != 'both') {
    set_swap_source(key, 'both', null);
    return;
  }
  if (swap_selected_key == key) {
    clear_swap_selection();
    return;
  }
  apply_swap_to_keyboard('both', swap_selected_key, key);
  clear_swap_selection();
}

function on_swap_button_clicked(mode, x, y) {
  var key = get_key_by_xy(x, y);
  if (key == null) {
    return;
  }
  if (is_no_swap_key(key)) {
    return;
  }
  var button_id = (mode == 'sheng') ? ('swap_sm_' + y + x) : ('swap_py_' + y + x);
  if (swap_selected_key == null) {
    set_swap_source(key, mode, button_id);
    return;
  }
  if (swap_selected_mode != mode) {
    set_swap_source(key, mode, button_id);
    return;
  }
  if (swap_selected_key == key) {
    clear_swap_selection();
    return;
  }
  apply_swap_to_keyboard(mode, swap_selected_key, key);
  clear_swap_selection();
}

function ensure_swap_buttons_present() {
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 10; ++x) {
      var sm = document.getElementById('sm_' + y + x);
      if (sm != null) {
        var b1 = document.getElementById('swap_sm_' + y + x);
        if (b1 == null) {
          b1 = document.createElement('button');
          b1.id = 'swap_sm_' + y + x;
          b1.type = 'button';
          b1.className = 'swap-btn';
        }
        b1.innerHTML = '⇄';
        b1.title = '只对调声母';
        var sm_wrapped = (sm.parentNode != null && sm.parentNode.classList != null && sm.parentNode.classList.contains('swap-input-row'));
        if (sm.parentNode != null && !sm_wrapped) {
          var wrap1 = document.createElement('span');
          wrap1.className = 'swap-input-row';
          sm.parentNode.insertBefore(wrap1, sm);
          wrap1.appendChild(b1);
          wrap1.appendChild(sm);
        } else if (sm.parentNode != null) {
          sm.parentNode.insertBefore(b1, sm);
        }
      }
      var py = document.getElementById('py_' + y + x);
      if (py != null) {
        var b2 = document.getElementById('swap_py_' + y + x);
        if (b2 == null) {
          b2 = document.createElement('button');
          b2.id = 'swap_py_' + y + x;
          b2.type = 'button';
          b2.className = 'swap-btn';
        }
        b2.innerHTML = '⇄';
        b2.title = '只对调韵母';
        var py_wrapped = (py.parentNode != null && py.parentNode.classList != null && py.parentNode.classList.contains('swap-input-row'));
        if (py.parentNode != null && !py_wrapped) {
          var wrap2 = document.createElement('span');
          wrap2.className = 'swap-input-row';
          py.parentNode.insertBefore(wrap2, py);
          wrap2.appendChild(b2);
          wrap2.appendChild(py);
        } else if (py.parentNode != null) {
          py.parentNode.insertBefore(b2, py);
        }
      }
    }
  }
}

function ensure_lock_buttons_present() {
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 10; ++x) {
      var label = document.getElementById('key_' + y + x);
      if (label == null) {
        continue;
      }
      var wrap = label.parentNode;
      if (wrap != null && wrap.classList != null && wrap.classList.contains('keycap-row')) {
        var td0 = wrap.parentNode;
        if (td0 != null) {
          td0.insertBefore(label, wrap);
        }
        if (wrap.parentNode != null) {
          wrap.parentNode.removeChild(wrap);
        }
      }
      var td = label;
      while (td != null && td.tagName != null && String(td.tagName).toLowerCase() != 'td') {
        td = td.parentNode;
      }
      if (td == null) {
        continue;
      }
      var b = document.getElementById('lock_' + y + x);
      if (b == null) {
        b = document.createElement('button');
        b.id = 'lock_' + y + x;
        b.type = 'button';
        b.className = 'lock-btn';
      }
      if (b.parentNode != td) {
        td.appendChild(b);
      }
    }
  }
}

function refresh_lock_ui() {
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 10; ++x) {
      var key = get_key_by_xy(x, y);
      var b = document.getElementById('lock_' + y + x);
      if (b == null) {
        continue;
      }
      var locked = (key != null && locked_keys[key] === true);
      if (locked) {
        b.classList.add('lock-btn-locked');
        b.innerHTML = '🔒';
        b.title = '已固定（点击取消）';
      } else {
        b.classList.remove('lock-btn-locked');
        b.innerHTML = '🔓';
        b.title = '固定该键（不参与后续对调）';
      }
    }
  }
}

function bind_swap_ui() {
  ensure_swap_buttons_present();
  ensure_lock_buttons_present();
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 10; ++x) {
      var label = document.getElementById('key_' + y + x);
      if (label != null) {
        label.style.cursor = 'pointer';
        (function(xx, yy) {
          label.onclick = function() { on_keycap_clicked(xx, yy); };
        })(x, y);
      }
      var lock = document.getElementById('lock_' + y + x);
      if (lock != null) {
        (function(xx, yy) {
          lock.onclick = function() {
            var key = get_key_by_xy(xx, yy);
            if (key != null) {
              toggle_key_lock(key);
            }
          };
        })(x, y);
      }
      var bsm = document.getElementById('swap_sm_' + y + x);
      if (bsm != null) {
        (function(xx, yy) {
          bsm.onclick = function() { on_swap_button_clicked('sheng', xx, yy); };
        })(x, y);
      }
      var bpy = document.getElementById('swap_py_' + y + x);
      if (bpy != null) {
        (function(xx, yy) {
          bpy.onclick = function() { on_swap_button_clicked('yun', xx, yy); };
        })(x, y);
      }
    }
  }
  refresh_lock_ui();
  clear_swap_selection();
}

var layout_library_entries = [];
var selected_saved_layout_id = null;
var dragging_saved_layout_id = null;
var drag_over_saved_layout_id = null;
var last_saved_layout_drag_end_ms = 0;
var drag_over_saved_layout_insert_before = true;

function persist_layout_library_order(ids, keep_selected_id) {
  if (!Array.isArray(ids) || ids.length == 0) {
    return;
  }
  fetch('/api/layouts/reorder', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ids: ids}),
    cache: 'no-store'
  }).then(
    function(resp) {
      if (!resp.ok) {
        throw new Error('bad_status');
      }
      return resp.json();
    }).then(
    function(data) {
      layout_library_entries = (data || {}).entries || [];
      refresh_saved_layouts_ui(keep_selected_id || selected_saved_layout_id);
    }).catch(
    function(err) {
      reload_layout_library(keep_selected_id || selected_saved_layout_id);
    });
}

function reorder_layout_library_entries(from_id, to_id, insert_before) {
  from_id = String(from_id || '');
  to_id = String(to_id || '');
  if (from_id == '') {
    return;
  }
  var items = layout_library_entries || [];
  var from_idx = -1;
  var to_idx = -1;
  for (var i = 0; i < items.length; ++i) {
    var id = String((items[i] || {}).id || '');
    if (id == from_id) {
      from_idx = i;
    }
    if (to_id != '' && id == to_id) {
      to_idx = i;
    }
  }
  if (from_idx < 0) {
    return;
  }
  var moving = items[from_idx];
  items.splice(from_idx, 1);
  if (to_id == '' || to_idx < 0) {
    items.push(moving);
  } else {
    if (from_idx < to_idx) {
      to_idx -= 1;
    }
    if (!insert_before) {
      to_idx += 1;
    }
    to_idx = Math.max(0, Math.min(items.length, to_idx));
    items.splice(to_idx, 0, moving);
  }
  layout_library_entries = items;
}

function reload_layout_library(selected_id) {
  fetch('/api/layouts', {cache: 'no-store'}).then(
    function(resp) {
      if (!resp.ok) {
        throw new Error('bad_status');
      }
      return resp.json();
    }).then(
    function(data) {
      layout_library_entries = (data || {}).entries || [];
      refresh_saved_layouts_ui(selected_id);
    }).catch(
    function(err) {
      layout_library_entries = [];
      refresh_saved_layouts_ui(null);
      alert('无法读取布局文件，请用 local_server.py 启动本地服务。');
    });
}

function get_current_layout_score() {
  var scheme_name = document.getElementById('scheme-name').value;
  var layout_name = document.getElementById('layout-name').value;
  var geometry = document.getElementById('geometry').value;
  var result = (results[scheme_name] || {})[layout_name];
  result = (result || {})[geometry];
  if (result == null || result.time == null || result.chars == null || result.time == 0) {
    return null;
  }
  return result.chars / result.time * 200;
}

function get_symbol_tags_snapshot() {
  var tags = {};
  var layout = get_layout();
  for (var key in layout) {
    tags[key] = get_symbol_tag_for_key(key);
  }
  return tags;
}

function refresh_saved_layouts_ui(selected_id) {
  var list = document.getElementById('saved-layouts');
  if (list == null) {
    return;
  }
  var items = layout_library_entries || [];
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  if (items.length == 0) {
    selected_saved_layout_id = null;
    update_undo_replace_button();
    var empty = document.createElement('div');
    empty.className = 'saved-layout-empty';
    empty.innerHTML = '未保存';
    list.appendChild(empty);
    return;
  }
  if (selected_id != null) {
    selected_saved_layout_id = String(selected_id);
  } else if (selected_saved_layout_id != null) {
    var still_exists = false;
    for (var i = 0; i < items.length; ++i) {
      if (String((items[i] || {}).id) == String(selected_saved_layout_id)) {
        still_exists = true;
        break;
      }
    }
    if (!still_exists) {
      selected_saved_layout_id = null;
    }
  }
  update_undo_replace_button();
  for (var i = 0; i < items.length; ++i) {
    var it = items[i] || {};
    var id = String(it.id || '');
    var row = document.createElement('div');
    row.className = 'saved-layout-item';
    row.setAttribute('data-id', id);
    row.setAttribute('draggable', 'true');
    if (selected_saved_layout_id != null && String(selected_saved_layout_id) == id) {
      row.classList.add('saved-layout-item-selected');
    }
    var name = document.createElement('span');
    name.className = 'saved-layout-name';
    name.innerHTML = (it.name || '未命名');
    var score = document.createElement('span');
    score.className = 'saved-layout-score';
    score.innerHTML = (it.score == null) ? '' : (Number(it.score).toFixed(2));
    row.appendChild(name);
    row.appendChild(score);
    (function(layout_id) {
      row.onclick = function() {
        if (last_saved_layout_drag_end_ms != null && (Date.now() - last_saved_layout_drag_end_ms) < 350) {
          return;
        }
        selected_saved_layout_id = String(layout_id);
        refresh_saved_layouts_ui(selected_saved_layout_id);
      };
    })(id);
    (function(layout_id, row_el) {
      row_el.ondragstart = function(e) {
        dragging_saved_layout_id = String(layout_id);
        drag_over_saved_layout_id = null;
        drag_over_saved_layout_insert_before = true;
        row_el.classList.add('saved-layout-item-dragging');
        if (e != null && e.dataTransfer != null) {
          e.dataTransfer.effectAllowed = 'move';
          try {
            e.dataTransfer.setData('text/plain', dragging_saved_layout_id);
          } catch (err) {}
        }
      };
      row_el.ondragend = function(e) {
        dragging_saved_layout_id = null;
        drag_over_saved_layout_id = null;
        drag_over_saved_layout_insert_before = true;
        last_saved_layout_drag_end_ms = Date.now();
        row_el.classList.remove('saved-layout-item-dragging');
        var children = list.querySelectorAll('.saved-layout-item-drop-before, .saved-layout-item-drop-after');
        for (var i = 0; i < children.length; ++i) {
          children[i].classList.remove('saved-layout-item-drop-before');
          children[i].classList.remove('saved-layout-item-drop-after');
        }
      };
      row_el.ondragover = function(e) {
        if (e != null) {
          e.preventDefault();
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          if (e.dataTransfer != null) {
            e.dataTransfer.dropEffect = 'move';
          }
        }
        if (dragging_saved_layout_id == null || dragging_saved_layout_id == '') {
          return;
        }
        drag_over_saved_layout_id = String(layout_id);
        var rect = row_el.getBoundingClientRect();
        var insert_before = true;
        if (e != null && rect != null && rect.height > 0 && typeof e.clientY == 'number') {
          insert_before = e.clientY < (rect.top + rect.height / 2);
        }
        drag_over_saved_layout_insert_before = insert_before;
        var children = list.querySelectorAll('.saved-layout-item-drop-before, .saved-layout-item-drop-after');
        for (var i = 0; i < children.length; ++i) {
          children[i].classList.remove('saved-layout-item-drop-before');
          children[i].classList.remove('saved-layout-item-drop-after');
        }
        row_el.classList.add(insert_before ? 'saved-layout-item-drop-before' : 'saved-layout-item-drop-after');
      };
      row_el.ondrop = function(e) {
        if (e != null) {
          e.preventDefault();
          if (e.stopPropagation) {
            e.stopPropagation();
          }
        }
        var from_id = dragging_saved_layout_id;
        var to_id = String(layout_id);
        if (from_id == null || from_id == '' || from_id == to_id) {
          return;
        }
        var rect = row_el.getBoundingClientRect();
        var insert_before = true;
        if (e != null && rect != null && rect.height > 0 && typeof e.clientY == 'number') {
          insert_before = e.clientY < (rect.top + rect.height / 2);
        }
        reorder_layout_library_entries(from_id, to_id, insert_before);
        refresh_saved_layouts_ui(selected_saved_layout_id);
        var ids = [];
        var items2 = layout_library_entries || [];
        for (var i = 0; i < items2.length; ++i) {
          ids.push(String((items2[i] || {}).id || ''));
        }
        persist_layout_library_order(ids, selected_saved_layout_id);
      };
    })(id, row);
    list.appendChild(row);
  }
  list.ondragover = function(e) {
    if (e != null) {
      e.preventDefault();
      if (e.dataTransfer != null) {
        e.dataTransfer.dropEffect = 'move';
      }
    }
    if (dragging_saved_layout_id == null || dragging_saved_layout_id == '') {
      return;
    }
    var target = (e && e.target) ? e.target : null;
    var row = (target && target.closest) ? target.closest('.saved-layout-item') : null;
    if (row != null) {
      return;
    }
    var last = list.querySelector('.saved-layout-item:last-child');
    if (last == null) {
      return;
    }
    var children = list.querySelectorAll('.saved-layout-item-drop-before, .saved-layout-item-drop-after');
    for (var i = 0; i < children.length; ++i) {
      children[i].classList.remove('saved-layout-item-drop-before');
      children[i].classList.remove('saved-layout-item-drop-after');
    }
    last.classList.add('saved-layout-item-drop-after');
  };
  list.ondrop = function(e) {
    if (e != null) {
      e.preventDefault();
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    }
    var from_id = dragging_saved_layout_id;
    if (from_id == null || from_id == '') {
      return;
    }
    reorder_layout_library_entries(from_id, '', true);
    refresh_saved_layouts_ui(selected_saved_layout_id);
    var ids = [];
    var items2 = layout_library_entries || [];
    for (var i = 0; i < items2.length; ++i) {
      ids.push(String((items2[i] || {}).id || ''));
    }
    persist_layout_library_order(ids, selected_saved_layout_id);
  };
}

function init_saved_layouts_ui() {
  reload_layout_library(null);
}

var text_input_overlay_el = null;
var text_input_on_done = null;

function ensure_text_input_modal() {
  if (text_input_overlay_el != null) {
    return;
  }
  var overlay = document.createElement('div');
  overlay.className = 'text-input-overlay';
  overlay.id = 'text-input-overlay';

  var modal = document.createElement('div');
  modal.className = 'text-input-modal';

  var title = document.createElement('div');
  title.className = 'text-input-title';
  title.id = 'text-input-title';

  var input = document.createElement('input');
  input.className = 'text-input-field';
  input.id = 'text-input-field';
  input.type = 'text';

  var actions = document.createElement('div');
  actions.className = 'text-input-actions';

  var ok = document.createElement('button');
  ok.id = 'text-input-ok';
  ok.innerHTML = '确定';

  var cancel = document.createElement('button');
  cancel.id = 'text-input-cancel';
  cancel.innerHTML = '取消';

  actions.appendChild(cancel);
  actions.appendChild(ok);

  modal.appendChild(title);
  modal.appendChild(input);
  modal.appendChild(actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function close_with(value) {
    overlay.style.display = 'none';
    var cb = text_input_on_done;
    text_input_on_done = null;
    if (cb != null) {
      cb(value);
    }
  }

  ok.onclick = function() {
    close_with(String(input.value || ''));
  };
  cancel.onclick = function() {
    close_with(null);
  };
  overlay.onclick = function(e) {
    if (e != null && e.target === overlay) {
      close_with(null);
    }
  };
  input.addEventListener('keydown', function(e) {
    if (e == null) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      close_with(String(input.value || ''));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close_with(null);
    }
  });

  text_input_overlay_el = overlay;
}

function ask_text_input(title, default_value, cb) {
  ensure_text_input_modal();
  var overlay = text_input_overlay_el;
  var title_el = document.getElementById('text-input-title');
  var input_el = document.getElementById('text-input-field');
  if (overlay == null || title_el == null || input_el == null) {
    cb(null);
    return;
  }
  text_input_on_done = cb;
  title_el.innerHTML = title || '';
  input_el.value = default_value == null ? '' : String(default_value);
  overlay.style.display = 'flex';
  if (input_el.focus) {
    try {
      input_el.focus({preventScroll: true});
    } catch (e) {
      input_el.focus();
    }
  }
  if (input_el.select) {
    try {
      input_el.select();
    } catch (e) {}
  }
}

var last_replace_backup = null;

function set_undo_replace_enabled(enabled) {
  var btn = document.getElementById('undo-replace-layout');
  if (btn == null) return;
  btn.disabled = !enabled;
}

function update_undo_replace_button() {
  if (last_replace_backup == null || last_replace_backup.id == null || last_replace_backup.entry == null) {
    set_undo_replace_enabled(false);
    return;
  }
  if (selected_saved_layout_id == null || String(selected_saved_layout_id) != String(last_replace_backup.id)) {
    set_undo_replace_enabled(false);
    return;
  }
  set_undo_replace_enabled(true);
}

function save_current_layout() {
  var scheme_name = document.getElementById('scheme-name').value;
  var layout_name = document.getElementById('layout-name').value;
  var geometry = document.getElementById('geometry').value;
  var score = get_current_layout_score();
  var default_name = (score == null) ? ('布局 ' + layout_name) : ('布局 ' + Number(score).toFixed(2));
  ask_text_input('保存布局名称：', default_name, function(name) {
    if (name == null) {
      return;
    }
    name = String(name).trim();
    if (name == '') {
      return;
    }
    var entry = {
      id: String(Date.now()),
      name: name,
      createdAt: Date.now(),
      schemeName: scheme_name,
      layoutName: layout_name,
      geometry: geometry,
      scheme: get_scheme_from_keyboard(),
      symbolTags: get_symbol_tags_snapshot(),
      lockedKeys: get_locked_keys_snapshot(),
      score: score
    };
    fetch('/api/layouts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({entry: entry})
    }).then(
      function(resp) {
        if (!resp.ok) {
          throw new Error('bad_status');
        }
        return resp.json();
      }).then(
      function(data) {
        layout_library_entries = (data || {}).entries || [];
        refresh_saved_layouts_ui(entry.id);
      }).catch(
      function(err) {
        alert('保存失败：请确认用 local_server.py 启动本地服务。');
        reload_layout_library(null);
      });
  });
}

function build_current_layout_entry(id, name, created_at, score) {
  var scheme_name = document.getElementById('scheme-name').value;
  var layout_name = document.getElementById('layout-name').value;
  var geometry = document.getElementById('geometry').value;
  return {
    id: String(id),
    name: String(name),
    createdAt: created_at == null ? Date.now() : created_at,
    schemeName: scheme_name,
    layoutName: layout_name,
    geometry: geometry,
    scheme: get_scheme_from_keyboard(),
    symbolTags: get_symbol_tags_snapshot(),
    lockedKeys: get_locked_keys_snapshot(),
    score: score
  };
}

function find_saved_layout_by_id(id) {
  var items = layout_library_entries || [];
  for (var i = 0; i < items.length; ++i) {
    if (String((items[i] || {}).id) == String(id)) {
      return items[i];
    }
  }
  return null;
}

function replace_saved_layout_from_ui() {
  var scheme_name = document.getElementById('scheme-name').value;
  var id = selected_saved_layout_id;
  if (id == null || id == '') {
    alert('请先在列表中选择一个要替换的布局。');
    return;
  }
  var existing = find_saved_layout_by_id(id);
  if (existing == null) {
    alert('未找到所选布局，请刷新后重试。');
    reload_layout_library(null);
    return;
  }
  var ok = true;
  if (window.confirm) {
    ok = window.confirm('确定用“当前布局”替换“' + String(existing.name || '') + '”吗？');
  }
  if (!ok) {
    return;
  }

  var score = get_current_layout_score();
  var created_at = (existing || {}).createdAt;
  var entry = build_current_layout_entry(id, existing.name || '未命名', created_at, score);
  fetch('/api/layouts/' + encodeURIComponent(String(id)), {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({entry: entry})
  }).then(
    function(resp) {
      if (!resp.ok) {
        throw new Error('bad_status');
      }
      return resp.json();
    }).then(
    function(data) {
      var backup_entry = existing;
      try {
        backup_entry = JSON.parse(JSON.stringify(existing));
      } catch (e) {}
      last_replace_backup = { id: String(id), entry: backup_entry };
      layout_library_entries = (data || {}).entries || [];
      refresh_saved_layouts_ui(id);
      update_undo_replace_button();
    }).catch(
    function(err) {
      alert('替换失败：请确认用 local_server.py 启动本地服务。');
      reload_layout_library(id);
    });
}

function undo_replace_saved_layout_from_ui() {
  if (last_replace_backup == null || last_replace_backup.id == null || last_replace_backup.entry == null) {
    return;
  }
  var id = String(last_replace_backup.id);
  if (selected_saved_layout_id == null || String(selected_saved_layout_id) != id) {
    update_undo_replace_button();
    return;
  }
  var entry = last_replace_backup.entry;
  fetch('/api/layouts/' + encodeURIComponent(String(id)), {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({entry: entry})
  }).then(
    function(resp) {
      if (!resp.ok) {
        throw new Error('bad_status');
      }
      return resp.json();
    }).then(
    function(data) {
      layout_library_entries = (data || {}).entries || [];
      refresh_saved_layouts_ui(id);
      last_replace_backup = null;
      update_undo_replace_button();
    }).catch(
    function(err) {
      alert('撤回失败：请确认用 local_server.py 启动本地服务。');
      reload_layout_library(id);
    });
}

function apply_saved_layout(entry) {
  if (entry == null) {
    return;
  }
  clear_swap_selection();
  locked_keys = {};
  var locked = entry.lockedKeys || [];
  if (Array.isArray(locked)) {
    for (var i = 0; i < locked.length; ++i) {
      locked_keys[String(locked[i])] = true;
    }
  }
  if (entry.layoutName != null) {
    document.getElementById('layout-name').value = entry.layoutName;
  }
  if (entry.geometry != null) {
    document.getElementById('geometry').value = entry.geometry;
  }
  update_geometry(document.getElementById('geometry').value);
  if (entry.schemeName != null && document.getElementById('scheme-name') != null) {
    var normalized_scheme_name = entry.schemeName;
    if (normalized_scheme_name == '自定义') {
      normalized_scheme_name = '双拼';
    } else if (normalized_scheme_name == '全拼') {
      normalized_scheme_name = '全拼/英文';
    }
    document.getElementById('scheme-name').value = normalized_scheme_name;
  }
  var scheme_name = document.getElementById('scheme-name').value;
  if (results[scheme_name] == null) {
    add_empty_results(scheme_name);
  }
  results[scheme_name].scheme = entry.scheme || '';
  show_scheme('empty');
  show_scheme(scheme_name);
  reset_symbol_tags_to_physical_keys();
  var tags = entry.symbolTags || {};
  for (var key in tags) {
    set_symbol_tag_for_key(key, tags[key]);
  }
  show_layout();
  update_symbol_placeholders();
  refresh_lock_ui();
  hide_element('suggestion');
  var layout_name = document.getElementById('layout-name').value;
  var geometry = document.getElementById('geometry').value;
  if (results[scheme_name] != null && results[scheme_name][layout_name] != null) {
    results[scheme_name][layout_name][geometry] = null;
  }
  show_results(scheme_name);
}

function load_saved_layout_from_ui() {
  var id = selected_saved_layout_id;
  if (id == null || id == '') {
    return;
  }
  var items = layout_library_entries || [];
  for (var i = 0; i < items.length; ++i) {
    if (String(items[i].id) == String(id)) {
      apply_saved_layout(items[i]);
      return;
    }
  }
}

function delete_saved_layout_from_ui() {
  var id = selected_saved_layout_id;
  if (id == null || id == '') {
    return;
  }
  fetch('/api/layouts/' + encodeURIComponent(String(id)), {
    method: 'DELETE',
    cache: 'no-store'
  }).then(
    function(resp) {
      if (!resp.ok) {
        throw new Error('bad_status');
      }
      return resp.json();
    }).then(
    function(data) {
      layout_library_entries = (data || {}).entries || [];
      selected_saved_layout_id = null;
      refresh_saved_layouts_ui(null);
    }).catch(
    function(err) {
      alert('删除失败：请确认用 local_server.py 启动本地服务。');
      reload_layout_library(null);
    });
}

function rename_saved_layout_from_ui() {
  var id = selected_saved_layout_id;
  if (id == null || id == '') {
    return;
  }
  var items = layout_library_entries || [];
  var current_name = '';
  for (var i = 0; i < items.length; ++i) {
    if (String((items[i] || {}).id) == String(id)) {
      current_name = String((items[i] || {}).name || '');
      break;
    }
  }
  ask_text_input('重命名为：', current_name, function(name) {
    if (name == null) {
      return;
    }
    name = String(name).trim();
    if (name == '') {
      return;
    }
    fetch('/api/layouts/' + encodeURIComponent(String(id)), {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: name})
    }).then(
      function(resp) {
        if (!resp.ok) {
          throw new Error('bad_status');
        }
        return resp.json();
      }).then(
      function(data) {
        layout_library_entries = (data || {}).entries || [];
        refresh_saved_layouts_ui(id);
      }).catch(
      function(err) {
        alert('重命名失败：请确认用 local_server.py 启动本地服务。');
        reload_layout_library(id);
      });
  });
}

function update_geometry(geometry) {
  if (geometry == 'matrix') { // 直列
    document.getElementById('top-row').style.marginLeft = '0px';
    document.getElementById('middle-row').style.marginLeft = '0px';
    document.getElementById('bottom-row').style.marginLeft = '0px';
  } else if (geometry == 'staggered') { // 错列
    document.getElementById('top-row').style.marginLeft = '0px';
    document.getElementById('middle-row').style.marginLeft = '25px';
    document.getElementById('bottom-row').style.marginLeft = '75px';
  }
}

function add_empty_results(scheme_name) {
  results[scheme_name] = {
    scheme: schemes[scheme_name],
    qwerty: {},
    dvorak: {},
    colemak: {},
    workman: {},
  };
}

function show_scheme(scheme_name) {
  var geometry = document.getElementById('geometry').value;
  update_geometry(geometry);

  if (results[scheme_name] == null) {
    add_empty_results(scheme_name);
  }
  var scheme = results[scheme_name].scheme;
  var layout = get_layout();
  var assignments = scheme.split(',');
  for (var i = 0; i < assignments.length; ++i) {
    var items = assignments[i].split('=');
    var key = key_name_to_key(items[0]);
    var x = layout[key][0];
    var y = layout[key][1];
    if (scheme_name == '全拼/英文') {
      document.getElementById('sm_' + y + x).value = '';
      document.getElementById('py_' + y + x).value = (items[1] || '').trim();
    } else {
      var split = split_tokens_by_type(items[1]);
      document.getElementById('sm_' + y + x).value = split.sheng;
      document.getElementById('py_' + y + x).value = split.yun;
    }
  }
}

function evaluate_scheme(scheme_name, scheme) {
  var geometry = document.getElementById('geometry').value;
  var layout_name = document.getElementById('layout-name').value;
  var conversion = convert_text_to_key_strokes(scheme_name, scheme);
  var result = hit_key_strokes(conversion.strokes);
  result.chars = conversion.chars;
  result.error = conversion.error;
  if (results[scheme_name] == null) {
    add_empty_results(scheme_name);
  }
  results[scheme_name].scheme = scheme;
  results[scheme_name][layout_name][geometry] = result;
}

function evaluate_current_scheme() {
  var scheme_name = document.getElementById('scheme-name').value;
  var scheme = get_scheme_from_keyboard();
  evaluate_scheme(scheme_name, scheme);
  show_results(scheme_name);
}

function evaluate_all_schemes() {
  var current_scheme_name = document.getElementById('scheme-name').value;
  for (var scheme_name in schemes) {
    var scheme = schemes[scheme_name];
    if (results[scheme_name] != null) {
      scheme = results[scheme_name].scheme;
    }
    evaluate_scheme(scheme_name, scheme);
    if (scheme_name == current_scheme_name) {
      show_results(scheme_name);
    }
  }
}

function get_scheme_from_keyboard() {
  var scheme = '';
  var layout = get_layout();
  for (var key in layout) {
    var key_name = key_to_key_name(key);
    var x = layout[key][0];
    var y = layout[key][1];
    var sheng_value = document.getElementById('sm_' + y + x).value.trim();
    var yun_value = document.getElementById('py_' + y + x).value.trim();

    var merged_tokens = [];
    var seen = {};

    var sheng_parts = sheng_value.split(' ');
    for (var i = 0; i < sheng_parts.length; ++i) {
      var t = sheng_parts[i].trim();
      if (t == '') {
        continue;
      }
      t = t.toLowerCase();
      if (!seen[t]) {
        seen[t] = true;
        merged_tokens.push(t);
      }
    }

    var yun_parts = yun_value.split(' ');
    for (var i = 0; i < yun_parts.length; ++i) {
      var t = yun_parts[i].trim();
      if (t == '') {
        continue;
      }
      t = t.toLowerCase();
      if (!seen[t]) {
        seen[t] = true;
        merged_tokens.push(t);
      }
    }

    var pinyin = merged_tokens.join(' ');
    if (scheme != '') {
      scheme += ',';
    }
    scheme += key_name + '=' + pinyin;
  }
  return scheme;
}

function read_pinyin_map_from_scheme(scheme) {
  var error = '';

  // Read scheme mapping.
  var pinyin_map = {};
  var assignments = scheme.split(',');
  for (var i = 0; i < assignments.length; ++i) {
    var items = assignments[i].split('=');
    var key = items[0];
    if (key.length > 1) {
      if (punctuation_keys[key] == null) {
        continue;
      }
      key = punctuation_keys[key];
    } else {
      key = key.toLowerCase();
    }

    var pinyin = items[1].split(' ');
    for (var j = 0; j < pinyin.length; ++j) {
      var py = pinyin[j].trim();
      if (py == '') {
        continue;
      }
      if (py in pinyin_map) {
        pinyin_map[py] += key;
        error += py + '在' + pinyin_map[py].toUpperCase().split('').join('和') + '上\n';
      } else {
        pinyin_map[py] = key;
      }
    }
  }

  // 设置单个字母的默认映射
  for (var i = 0; i < letters.length; ++i) {
    if (pinyin_map[letters[i]] == null) {
      pinyin_map[letters[i]] = letters[i];
    }
  }
  return {pinyin_map: pinyin_map, error:error};
}

function pinyin_to_key_strokes(pinyin, sheng_yun_key_map, layout, is_staggered, only_sheng) {
  if (only_sheng === undefined) {
    only_sheng = false;
  }
  var sheng_yun = split_pinyin(pinyin);
  var sheng = sheng_yun.sheng;
  var yun = sheng_yun.yun;
  var zero_sheng_fallback_full_pinyin = false;
  if (sheng == '') {
    // 零声母
    if (sheng_yun_key_map['0'] != null) {
      sheng = '0';
    } else {
      sheng = yun[0]; // 否则, 声母取韵母的第一个字母
      if (yun.length == 2) {
        zero_sheng_fallback_full_pinyin = true;
      }
    }
  }
  var sheng_key = sheng_yun_key_map[sheng];
  if (only_sheng) {
    if (sheng_key == null) {
      var error = '无法打出声母' + sheng + '\n';
      return {key_strokes: '', error: error};
    }
    var ks = String(sheng_key || '');
    if (ks.length > 1) {
      ks = ks[0];
    }
    return {key_strokes: ks, error: ''};
  }
  if (yun == '') {
    // 零韵母
    return {key_strokes: sheng_key, error: ''};
  }
  var yun_key = zero_sheng_fallback_full_pinyin ? sheng_yun_key_map[yun[1]] : sheng_yun_key_map[yun];
  if (sheng_key == null || yun_key == null) {
    var error = '无法打出拼音' + pinyin + '=' + sheng + '+' + yun + '\n';
    return {key_strokes: '', error: error};
  }
  var best = get_multi_key_pair_time(sheng_key, yun_key, layout, is_staggered);
  return {key_strokes: best.key_strokes, error: ''};
}

function all_pinyin_to_key_strokes(all_pinyin, sheng_yun_key_map, only_sheng) {
  if (only_sheng === undefined) {
    only_sheng = false;
  }
  var geometry = document.getElementById('geometry').value;
  var is_staggered = (geometry == 'staggered');
  var layout = get_layout();
  var pinyin_key_map = {};
  var key_pinyin_map = {};
  var error = '';

  function format_key_strokes_for_error(key_strokes) {
    var physical = (key_strokes || '').toUpperCase();
    var labels = [];
    for (var i = 0; i < (key_strokes || '').length; ++i) {
      var key = (key_strokes || '')[i];
      labels.push(get_keycap_label_for_key(key));
    }
    var label_str = labels.join('');
    if (label_str == '' || label_str == '∅') {
      return physical;
    }
    return label_str;
  }

  for (var i = 0; i < all_pinyin.length; ++i) {
    var conversion = pinyin_to_key_strokes(all_pinyin[i], sheng_yun_key_map, layout, is_staggered, only_sheng);
    if (conversion.error != '') {
      return {pinyin_key_map: {}, error: conversion.error};
    }
    pinyin_key_map[all_pinyin[i]] = conversion.key_strokes;
    if (!only_sheng) {
      var existing_pinyin = key_pinyin_map[conversion.key_strokes]; // 以下检查是否有多个拼音共用同个按键序列
      if (existing_pinyin == null) {
        key_pinyin_map[conversion.key_strokes] = all_pinyin[i];
      } else {
        error += all_pinyin[i] + '和' + existing_pinyin + '都是' +
          format_key_strokes_for_error(conversion.key_strokes) + '\n';
      }
    }
  }
  //console.log(pinyin_key_map);打印
  return {pinyin_key_map: pinyin_key_map, error: error};
}

function get_irrational_char_pinyin() {
  var irrational_pinyins = document.getElementById('irrational-pinyin').value.split(/[ ,，]/);
  var irrational_char_pinyin = {};
  for (var i = 0; i < irrational_pinyins.length; ++i) {
    var items = irrational_pinyins[i].split('=');
    if (items.length == 2) {
      irrational_char_pinyin[items[0]] = items[1];
    }
  }
  return irrational_char_pinyin;
}

function build_full_pinyin_token_pair_freq_from_input_text(use_irrational_pinyin, irrational_char_pinyin) {
  var input = document.getElementById('input-text').value;
  var tokens = [];
  for (var i = 0; i < input.length; ++i) {
    var c = input[i].trim();
    if (c == '') {
      continue;
    }
    if (letters.includes(c.toLowerCase())) {
      tokens.push(c.toLowerCase());
      continue;
    }
    var punctuation = punctuations[c];
    if (punctuation != null) {
      tokens.push(punctuation);
      continue;
    }
    var pinyin = char_pinyin[c];
    if (pinyin == null) {
      continue;
    }
    if (use_irrational_pinyin) {
      var irrational_pinyin = irrational_char_pinyin[c];
      if (irrational_pinyin != null && irrational_pinyin.trim() != '') {
        pinyin = irrational_pinyin.trim();
      }
    }
    var s = String(pinyin || '').toLowerCase();
    for (var j = 0; j < s.length; ++j) {
      var ch = s[j];
      if (letters.includes(ch)) {
        tokens.push(ch);
      }
    }
  }

  var pair_freq = {};
  for (var i = 0; i + 1 < tokens.length; ++i) {
    var first = tokens[i];
    var second = tokens[i + 1];
    if (pair_freq[first] == null) {
      pair_freq[first] = {};
    }
    if (pair_freq[first][second] == null) {
      pair_freq[first][second] = 0;
    }
    pair_freq[first][second] += 1;
  }
  return pair_freq;
}

function fast_evaluate_full_pinyin_tokens(pinyin_map, state, token_pair_freq) {
  var geometry = document.getElementById('geometry').value;
  var is_staggered = (geometry == 'staggered');
  var layout = get_layout();

  var symbol_to_key = {};
  for (var k in layout) {
    var tag = String(((state || {}).symbol_tags || {})[k] || '');
    if (tag != '') {
      symbol_to_key[tag] = k;
    }
  }

  function resolve_token_to_key(token) {
    if (token == null || token == '') {
      return null;
    }
    var t = String(token);
    if (t.length == 1 && letters.includes(t)) {
      var ks = pinyin_map[t];
      if (ks == null || String(ks).length == 0) {
        return null;
      }
      return String(ks)[0];
    }
    var sym_key = symbol_to_key[t];
    if (sym_key != null && layout[sym_key] != null) {
      return sym_key;
    }
    if (layout[t] != null) {
      return t;
    }
    return null;
  }

  var time = 0;
  for (var first in token_pair_freq) {
    var first_key = resolve_token_to_key(first);
    if (first_key == null) {
      continue;
    }
    for (var second in token_pair_freq[first]) {
      var second_key = resolve_token_to_key(second);
      if (second_key == null) {
        continue;
      }
      var hit_time = get_cached_key_pair_time(first_key, second_key, layout, is_staggered);
      time += hit_time * token_pair_freq[first][second];
    }
  }
  return time;
}

function full_pinyin_string_to_key_strokes(pinyin, letter_key_map) {
  var out = '';
  var s = String(pinyin || '').toLowerCase();
  for (var i = 0; i < s.length; ++i) {
    var ch = s[i];
    if (!letters.includes(ch)) {
      continue;
    }
    var ks = letter_key_map[ch];
    if (ks == null || String(ks).length == 0) {
      return { key_strokes: '', error: '无法打出字母' + ch + '\n' };
    }
    out += String(ks)[0];
  }
  return { key_strokes: out, error: '' };
}

function convert_text_to_key_strokes(scheme_name, scheme) {
  var pm = read_pinyin_map_from_scheme(scheme);
  var error = pm.error;
  var only_sheng = (scheme_name == '声母模式');

  var merged_all_pinyin = [...all_pinyin];
  var use_irrational_pinyin = document.getElementById('enable-irrational-pinyin').checked;
  var irrational_char_pinyin = {};
  if (use_irrational_pinyin) {
    irrational_char_pinyin = get_irrational_char_pinyin();
    for (var c in irrational_char_pinyin) {
      merged_all_pinyin.push(irrational_char_pinyin[c]);
    }
  }

  var pinyin_key_map = {};
  if (scheme_name == '全拼/英文') {
    for (var i = 0; i < merged_all_pinyin.length; ++i) {
      var conv = full_pinyin_string_to_key_strokes(merged_all_pinyin[i], pm.pinyin_map);
      if (conv.error != '') {
        return {strokes: '', error: conv.error};
      }
      pinyin_key_map[merged_all_pinyin[i]] = conv.key_strokes;
    }
  } else {
    var conversion = all_pinyin_to_key_strokes(merged_all_pinyin, pm.pinyin_map, only_sheng);
    if (Object.keys(conversion.pinyin_key_map).length < merged_all_pinyin.length) {
      return {strokes: '', error: conversion.error};
    }
    pinyin_key_map = conversion.pinyin_key_map;
    error += conversion.error;
  }

  // 将字符转换为关键笔划
  var input = document.getElementById('input-text').value;
  var chars = 0;
  var key_strokes_parts = [];
  var ignored_chars = new Set();
  var ignored_pinyins = new Set();
  var symbol_tag_to_key = {};
  {
    var layout = get_layout();
    for (var key in layout) {
      var tag = String(get_symbol_tag_for_key(key) || '');
      if (tag != '') {
        symbol_tag_to_key[tag] = key;
      }
    }
  }
  for (var i = 0; i < input.length; ++i) {
    var c = input[i].trim();
    if (c == '') {
      continue;
    }
    var punctuation = punctuations[c];
    if (punctuation != null) {
      var punctuation_key = symbol_tag_to_key[punctuation] || punctuation;
      chars++;
      key_strokes_parts.push(punctuation_key);
      continue;
    }
    var lower = c.toLowerCase();
    if (letters.includes(lower)) {
      chars++;
      if (scheme_name == '全拼/英文') {
        var ks = pm.pinyin_map[lower];
        if (ks == null || String(ks).length == 0) {
          ignored_chars.add(c);
          continue;
        }
        key_strokes_parts.push(String(ks)[0]);
      } else {
        key_strokes_parts.push(lower);
      }
      continue;
    }
    var pinyin = char_pinyin[c];
    if (pinyin == null) {
      ignored_chars.add(c);
      continue;
    }
    if (use_irrational_pinyin) {
      var irrational_pinyin = irrational_char_pinyin[c];
      if (irrational_pinyin != null) {
        pinyin = irrational_pinyin;
      }
    }
    if (!(pinyin in pinyin_key_map)) {
      ignored_pinyins.add(pinyin);
      continue;
    }
    chars++;
    key_strokes_parts.push(pinyin_key_map[pinyin]);
  }
  if (ignored_chars.size > 0) {
    console.log('忽略的字符: ' + Array.from(ignored_chars).join(''));
  }
  if (ignored_pinyins.size > 0) {
    console.log('忽略的拼音: ' + Array.from(ignored_pinyins).join('，'));
  }
  return {chars:chars, strokes:key_strokes_parts.join(''), error:error};
}

function convert_text_to_key_strokes_with_symbol_tags(scheme_name, scheme, symbol_tags) {
  var pm = read_pinyin_map_from_scheme(scheme);
  var error = pm.error;

  var merged_all_pinyin = [...all_pinyin];
  var use_irrational_pinyin = document.getElementById('enable-irrational-pinyin').checked;
  var irrational_char_pinyin = {};
  if (use_irrational_pinyin) {
    irrational_char_pinyin = get_irrational_char_pinyin();
    for (var c in irrational_char_pinyin) {
      merged_all_pinyin.push(irrational_char_pinyin[c]);
    }
  }

  var pinyin_key_map = {};
  if (scheme_name == '全拼/英文') {
    for (var i = 0; i < merged_all_pinyin.length; ++i) {
      pinyin_key_map[merged_all_pinyin[i]] = merged_all_pinyin[i];
    }
  } else {
    var conversion = all_pinyin_to_key_strokes(merged_all_pinyin, pm.pinyin_map);
    if (Object.keys(conversion.pinyin_key_map).length < merged_all_pinyin.length) {
      return {strokes: '', error: conversion.error};
    }
    pinyin_key_map = conversion.pinyin_key_map;
    error += conversion.error;
  }

  var input = document.getElementById('input-text').value;
  var chars = 0;
  var key_strokes_parts = [];
  var ignored_chars = new Set();
  var ignored_pinyins = new Set();
  var symbol_tag_to_key = {};
  {
    var layout = get_layout();
    for (var key in layout) {
      var tag = String((symbol_tags || {})[key] || '');
      if (tag != '') {
        symbol_tag_to_key[tag] = key;
      }
    }
  }
  for (var i = 0; i < input.length; ++i) {
    var c = input[i].trim();
    if (c == '') {
      continue;
    }
    var punctuation = punctuations[c];
    if (punctuation != null) {
      var punctuation_key = symbol_tag_to_key[punctuation] || punctuation;
      chars++;
      key_strokes_parts.push(punctuation_key);
      continue;
    }
    var lower = c.toLowerCase();
    if (letters.includes(lower)) {
      chars++;
      key_strokes_parts.push(lower);
      continue;
    }
    var pinyin = char_pinyin[c];
    if (pinyin == null) {
      ignored_chars.add(c);
      continue;
    }
    if (use_irrational_pinyin) {
      var irrational_pinyin = irrational_char_pinyin[c];
      if (irrational_pinyin != null) {
        pinyin = irrational_pinyin;
      }
    }
    if (!(pinyin in pinyin_key_map)) {
      ignored_pinyins.add(pinyin);
      continue;
    }
    chars++;
    key_strokes_parts.push(pinyin_key_map[pinyin]);
  }
  return {chars:chars, strokes:key_strokes_parts.join(''), error:error};
}

function compute_layout_score_for_scheme_with_symbol_tags(scheme_name, scheme, symbol_tags) {
  var conversion = convert_text_to_key_strokes_with_symbol_tags(scheme_name, scheme, symbol_tags || {});
  var result = hit_key_strokes(conversion.strokes);
  if (result == null || result.time == null || result.time == 0) {
    return null;
  }
  return conversion.chars / result.time * 200;
}

function caigaidong (f,x0,y0,x1,y1){
  if(x0 == x1){

    if(y0 > y1){
        return finger_speed_up[f];
    }
    else if(y0 < y1){
      return finger_speed_down[f];
    }
    else if(y0 == y1){
      return finger_speed[f];
    }
  }
  else{

    if(y0 == y1){
      return index_speed_horizon;
    }
    else if(y0 > y1){
      return index_speed_upslash;
    }
    else if(y0 < y1){
      return index_speed_downslash;
    }
  }

}





















function hit_key_strokes(key_strokes) { // 计算 // 模拟敲击文本序列
  // 统计结果
  var result = {};
  result.hits = key_strokes.length;
  result.time = 0;                   // 时间
  result.effective_distance = 0;     // 有效距离
  result.overlap_distance = 0;       // 重叠距离
  result.same_hand_hits = 0;         // 同手击键
  result.same_finger_hits = [0, 0, 0, 0];
  result.diff_finger_hits = [0, 0, 0, 0];
  result.heat_map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  var geometry = document.getElementById('geometry').value;
  var is_staggered = (geometry == 'staggered'); // 是 错列吗


  // 手的位置，相对于初始位置。
  var left_hand_pos = [0, 0];
  var right_hand_pos = [0, 0];

  var last_column = 0; // 上次敲键用的手指，用列的序号来表示
  var layout = get_layout();
  for (var i = 0; i < key_strokes.length; ++i) {
    var key = key_strokes[i];
    var coordinates = layout[key];
    var x = coordinates[0], y = coordinates[1]; // 找到 键 的坐标 // 这里x、y 用来表示这次按键的位置

    // 计算移动距离
    var finger = column_finger[x]; // 这次获得需要用到的手指

    var x0, y0, same_hand;
    if (is_left(x)) { // 是左手
      same_hand = is_left(last_column);

      x0 = finger + left_hand_pos[0]; // 上次按键的x
      y0 = 1 + left_hand_pos[1];      // 上次按键的y

      left_hand_pos[0] = x - finger;
      left_hand_pos[1] = y - 1;
    } else {          // 是右手
      same_hand = is_right(last_column)

      x0 = finger + right_hand_pos[0];
      y0  = 1 + right_hand_pos[1];

      right_hand_pos[0] = x - finger;
      right_hand_pos[1] = y - 1;
    }

    var d = press_depth;
    var move_dist = distance(x0, y0, x, y, is_staggered);

    if (same_hand) {
      d += move_dist;
    }

    // 更新统计信息
    ++result.heat_map[y][x];

    result.time += d / caigaidong(finger,x0,y0,x,y);//////////////////////////////////////////////////

    result.effective_distance += d;
    if (same_hand) {
      ++result.same_hand_hits;
    } else {
      result.overlap_distance += move_dist;
    }
    var dist_bucket = Math.floor(d);
    if (dist_bucket >= 0 && dist_bucket < result.same_finger_hits.length) {
      if (finger == column_finger[last_column]) {
          result.same_finger_hits[dist_bucket] += 1;
      } else if (same_hand) {
          result.diff_finger_hits[dist_bucket] += 1;
      }
    }

    last_column = x;
  }
  return result;
}




function update_improvement_ui(scheme_name) {
  show_element('improvement');
  var disabled = false;
  var ids = [
    'improve-mode',
    'improve-two-step',
    'improve',
    'improve-allow-worse',
    'improve-beam-width',
    'global-search-sa',
    'global-search-tabu',
    'sa-steps',
    'sa-restarts',
    'sa-temp',
    'tabu-steps',
    'tabu-tenure',
    'tabu-candidates',
  ];
  for (var i = 0; i < ids.length; ++i) {
    var el = document.getElementById(ids[i]);
    if (el != null) {
      el.disabled = disabled;
    }
  }
}

function show_results(scheme_name) {
  update_improvement_ui(scheme_name);
  var geometry = document.getElementById('geometry').value;
  var layout_name = document.getElementById('layout-name').value;
  var result = results[scheme_name][layout_name][geometry];
  show_heat_map(result);
  if (result == null) {
    hide_element('result');
    return;
  }

  // 显示统计信息
  show_element('result');
  var hits = result.hits;
  var time = result.time;
  var speed = hits / time * 100;
  var score = result.chars / time * 200;
  var total_distance = result.effective_distance + result.overlap_distance;
  set_inner_html('error', result.error.trim().replace(/\n/g, '，'));
  set_inner_html('score', score.toFixed(2) + '分');
  update_old_layout_score_ui();
  set_inner_html('hits', hits);
  set_inner_html('time', Math.round(time));
  set_inner_html('avg_time', (time / hits).toFixed(2));
  set_inner_html('distance', Math.round(total_distance));
  set_inner_html('avg_distance', (total_distance / hits).toFixed(2));
  set_inner_html('effective_distance', Math.round(result.effective_distance));
  set_inner_html('overlap_distance', Math.round(result.overlap_distance));
  set_inner_html('distance', Math.round(total_distance));
  set_inner_html('effective_distance', Math.round(result.effective_distance));
  set_inner_html('avg_effective_distance', (result.effective_distance / hits).toFixed(2));
  set_inner_html('overlap_distance', Math.round(result.overlap_distance));
  set_inner_html('avg_overlap_distance', (result.overlap_distance / hits).toFixed(2));

  set_inner_html('same_hand', percent_str(result.same_hand_hits , hits));
  for (var i = 0; i < 3; ++i) {
    set_inner_html('same_finger_' + i,
                   percent_str(result.same_finger_hits[i], hits));
  }
  for (var i = 0; i < 3; ++i) {
    set_inner_html('diff_finger_' + i,
                   percent_str(result.diff_finger_hits[i], hits));
  }

  var row_load = [0, 0, 0];
  var finger_load = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var left_load = 0, right_load = 0;
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 10; ++x) {
      var heat = result.heat_map[y][x];
      row_load[y] += heat;
      finger_load[column_finger[x]] += heat;
      if (is_left(x)) {
        left_load += heat;
      } else {
        right_load += heat;
      }
    }
  }

  for (var x = 0; x < 10; ++x) {
    if (x < 4 || x > 5) {
      set_inner_html('finger_' + x, percent_str(finger_load[x], hits));
    }
  }
  set_inner_html('left_hand', percent_str(left_load, hits));
  set_inner_html('right_hand', percent_str(right_load, hits));
  for (var y = 0; y < 3; ++y) {
    set_inner_html('row_' + y, percent_str(row_load[y], hits));
  }
}

function hide_element(id) {
  document.getElementById(id).style.display = 'none';
}

function show_element(id) {
  var el = document.getElementById(id);
  if (el == null) {
    return;
  }
  var tag = (el.tagName || '').toLowerCase();
  if (tag == 'td' || tag == 'th') {
    el.style.display = 'table-cell';
  } else if (tag == 'tr') {
    el.style.display = 'table-row';
  } else if (tag == 'select' || tag == 'input' || tag == 'textarea' || tag == 'button' || tag == 'label') {
    el.style.display = 'inline-block';
  } else {
    el.style.display = 'block';
  }
}

function set_inner_html(id, value) {
  document.getElementById(id).innerHTML = value;
}

function show_heat_map(result) {
  // 更新键盘热图
  var layout = get_layout();
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];
    var cell = document.getElementById('heat_' + y + x);
    if (result == null) {
      cell.innerHTML = '&nbsp;';
      cell.style.backgroundColor = 'inherit';
    } else {
      var heat = percent(result.heat_map[y][x], result.hits);
      cell.innerHTML = heat + '%';
      var green = Math.round(255 - 255 * Math.min(heat, 10) / 10);
      cell.style.backgroundColor = 'rgb(255, ' + green + ', 0)';
    }
  }
}

// 两个键之间的距离
function distance(x0, y0, x1, y1, is_staggered) { ////////////////////////////
  if (is_staggered) {
    if (y0 > 0)
      x0 += 0.25 + (y0 - 1) * 0.5;
    if (y1 > 0)
      x1 += 0.25 + (y1 - 1) * 0.5;
  }

  return Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1));
}

function is_left(x) { // 是左手吗 ，（）填手指序号
  return x < 5;
}

function is_right(x) { // 是右手吗 ，（）填手指序号
  return x >= 5;
}

function percent(part, whole, precision = 1) {
  if (whole == 0) {
    return 0;
  }
  return (part * 100.0 / whole).toFixed(precision);
}

function percent_str(part, whole, precision = 1) {
  return percent(part, whole, precision) + '%';
}

function pad(string, length) {
  while (string.length < length) {
    string += ' ';
  }
  return string;
}

function clear_error() {
  set_inner_html('error', '');
}

function total_pairs(pair_freq) {
  var total = 0;
  for (first in pair_freq) {
    for (second in pair_freq[first]) {
      total += pair_freq[first][second];
    }
  }
  return total;
}

var key_pair_time_cache = { cache_key: '', times: null };

function get_key_pair_time(first_key, second_key, layout, is_staggered) { ///////////////////////
  if (layout[first_key] == null || layout[second_key] == null) {
    return 999999;
  }
  var x0 = layout[first_key][0]; // 上一个键的x
  var y0 = layout[first_key][1]; // 上一个键的y

  var x1 = layout[second_key][0]; // 这次的键的x
  var y1 = layout[second_key][1]; // 这次的键的y

  var f0 = column_finger[x0]; // 上次用的手指
  var f1 = column_finger[x1]; // 这次用的手指

  var same_hand = is_left(x0) == is_left(x1); // 用来判断是否同手

  var d = press_depth;

  if (f0 == f1) { // 同指
    d += distance(x0, y0, x1, y1, is_staggered);
  }
  else if (same_hand) { // 同手不同指
    d += distance(x0 + f1 - f0, y0, x1, y1, is_staggered);
  }

  return d / caigaidong(f1,x0,y0,x1,y1);////////////////////////////////////////////////////////////////
}

function get_cached_key_pair_time(first_key, second_key, layout, is_staggered) {
  var layout_name = document.getElementById('layout-name').value;
  var geometry = document.getElementById('geometry').value;
  var cache_key = layout_name + '|' + geometry;
  if (key_pair_time_cache.cache_key != cache_key || key_pair_time_cache.times == null) {
    var times = {};
    for (var k1 in layout) {
      times[k1] = {};
      for (var k2 in layout) {
        times[k1][k2] = get_key_pair_time(k1, k2, layout, is_staggered);
      }
    }
    key_pair_time_cache = { cache_key: cache_key, times: times };
  }
  var row = key_pair_time_cache.times[first_key];
  if (row == null) {
    return get_key_pair_time(first_key, second_key, layout, is_staggered);
  }
  var cached = row[second_key];
  if (cached == null) {
    return get_key_pair_time(first_key, second_key, layout, is_staggered);
  }
  return cached;
}

function get_multi_key_pair_time(sheng_keys, yun_keys, layout, is_staggered) { // 计算时间最少的组合
  var best_key_strokes = '';
  var best_cost = 999999;
  for (var i = 0; i < (sheng_keys || '').length; ++i) {
    var s = (sheng_keys || '')[i];
    for (var j = 0; j < (yun_keys || '').length; ++j) {
      var y = (yun_keys || '')[j];
      var cost = get_cached_key_pair_time(s, y, layout, is_staggered);
      if (cost < best_cost) {
        best_cost = cost;
        best_key_strokes = s + y;
      }
    }
  }
  return {key_strokes: best_key_strokes, hit_time: best_cost};
}

function fast_evaluate_scheme(pinyin_map, pair_freq) {
  var geometry = document.getElementById('geometry').value;
  var is_staggered = (geometry == 'staggered');

  var has_zero_sheng = (pinyin_map['0'] != null);
  var layout = get_layout();
  var time = 0;
  for (first in pair_freq) {
    for (second in pair_freq[first]) {
      var first_key = pinyin_map[first];
      if (first == '') {
        if (has_zero_sheng)
          first_key = pinyin_map['0'];
        else
          first_key = pinyin_map[second[0]];
      }
      if (first_key == null) {
        first_key = first;
      }
      var second_key = pinyin_map[second];
      if (first == '' && !has_zero_sheng && second.length == 2) {
        second_key = pinyin_map[second[1]];
      }
      if (second == '') {
        if (has_zero_sheng)
          second_key = pinyin_map['0'];
        else
          second_key = pinyin_map['a'];
      }
      if (second_key == null) {
        second_key = second;
      }
      if (first_key.length > 1 || second_key.length > 1) {
        var best = get_multi_key_pair_time(first_key, second_key, layout, is_staggered);
        time += best.hit_time * pair_freq[first][second];
      } else {
        var hit_time = get_cached_key_pair_time(first_key, second_key, layout, is_staggered);
        time += hit_time * pair_freq[first][second];
      }
    }
  }
  return time;
}

function clone_map(map) {
  var copied = {};
  for (var k in map) {
    copied[k] = map[k];
  }
  return copied;
}

function get_key_field_values(prefix) {
  var layout = get_layout();
  var key_values = {};
  var key_tokens = {};
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];
    var value = document.getElementById(prefix + y + x).value.trim();
    key_values[key] = value;

    var tokens = [];
    var parts = value.split(' ');
    for (var i = 0; i < parts.length; ++i) {
      var t = parts[i].trim().toLowerCase();
      if (t != '') {
        tokens.push(t);
      }
    }
    key_tokens[key] = tokens;
  }
  return {key_values: key_values, key_tokens: key_tokens};
}

function replace_all_keys(mapping, from_key, to_key) {
  return (mapping || '').split(from_key).join(to_key);
}

function swap_all_keys(mapping, first, second) {
  var out = String(mapping || '');
  if (first == null || second == null || first == '' || second == '' || first == second) {
    return out;
  }
  var placeholder = '\u0001';
  while (out.includes(placeholder) || String(first).includes(placeholder) || String(second).includes(placeholder)) {
    placeholder = String.fromCharCode(placeholder.charCodeAt(0) + 1);
  }
  return out.split(first).join(placeholder).split(second).join(first).split(placeholder).join(second);
}

function clone_keyboard_state(state) {
  var copied = {
    sm_values: {},
    py_values: {},
    symbol_tags: {},
  };
  for (var k in state.sm_values) copied.sm_values[k] = state.sm_values[k];
  for (var k in state.py_values) copied.py_values[k] = state.py_values[k];
  for (var k in state.symbol_tags) copied.symbol_tags[k] = state.symbol_tags[k];
  return copied;
}

function read_keyboard_state() {
  var layout = get_layout();
  var state = { sm_values: {}, py_values: {}, symbol_tags: {} };
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];
    state.sm_values[key] = document.getElementById('sm_' + y + x).value.trim();
    state.py_values[key] = document.getElementById('py_' + y + x).value.trim();
    state.symbol_tags[key] = get_symbol_tag_for_key(key) || '';
  }
  return state;
}

function write_keyboard_state(state) {
  var layout = get_layout();
  for (var key in layout) {
    var x = layout[key][0];
    var y = layout[key][1];
    var sm = document.getElementById('sm_' + y + x);
    var py = document.getElementById('py_' + y + x);
    if (sm != null) {
      sm.value = (state.sm_values[key] || '');
    }
    if (py != null) {
      py.value = (state.py_values[key] || '');
    }
    set_symbol_tag_for_key(key, (state.symbol_tags[key] || ''));
  }
}

function compute_layout_score_exact_for_state(scheme_name, state) {
  var backup = read_keyboard_state();
  write_keyboard_state(state);
  var scheme = get_scheme_from_keyboard();
  var conversion = convert_text_to_key_strokes(scheme_name, scheme);
  var result = hit_key_strokes(conversion.strokes);
  write_keyboard_state(backup);
  if (result == null || result.time == null || result.time == 0) {
    return null;
  }
  return conversion.chars / result.time * 200;
}

function get_scheme_from_state(state) {
  var scheme = '';
  var layout = get_layout();
  for (var key in layout) {
    var key_name = key_to_key_name(key);
    var sheng_value = (state.sm_values[key] || '').trim();
    var yun_value = (state.py_values[key] || '').trim();

    var merged_tokens = [];
    var seen = {};

    var sheng_parts = sheng_value.split(' ');
    for (var i = 0; i < sheng_parts.length; ++i) {
      var t = sheng_parts[i].trim();
      if (t == '') {
        continue;
      }
      t = t.toLowerCase();
      if (!seen[t]) {
        seen[t] = true;
        merged_tokens.push(t);
      }
    }

    var yun_parts = yun_value.split(' ');
    for (var i = 0; i < yun_parts.length; ++i) {
      var t = yun_parts[i].trim();
      if (t == '') {
        continue;
      }
      t = t.toLowerCase();
      if (!seen[t]) {
        seen[t] = true;
        merged_tokens.push(t);
      }
    }

    var pinyin = merged_tokens.join(' ');
    if (scheme != '') {
      scheme += ',';
    }
    scheme += key_name + '=' + pinyin;
  }
  return scheme;
}

function apply_swap_to_state(state, layer, key1, key2) {
  var sm1 = (state.sm_values[key1] || '').trim();
  var sm2 = (state.sm_values[key2] || '').trim();
  var py1 = (state.py_values[key1] || '').trim();
  var py2 = (state.py_values[key2] || '').trim();

  var either_has_symbol = (state.symbol_tags[key1] || '') != '' || (state.symbol_tags[key2] || '') != '';
  var either_empty_key = either_has_symbol ||
    (letters.includes(key1) && sm1 == '' && py1 == '') ||
    (letters.includes(key2) && sm2 == '' && py2 == '');
  var either_has_vowel = split_yun_value(py1).vowels.length > 0 || split_yun_value(py2).vowels.length > 0;

  if (layer == 'yun') {
    if (either_empty_key || either_has_vowel) {
      state.sm_values[key1] = sm2;
      state.sm_values[key2] = sm1;
      state.py_values[key1] = py2;
      state.py_values[key2] = py1;
      if (either_has_symbol) {
        var tmp = state.symbol_tags[key1];
        state.symbol_tags[key1] = state.symbol_tags[key2];
        state.symbol_tags[key2] = tmp;
      }
    } else {
      state.py_values[key1] = py2;
      state.py_values[key2] = py1;
    }
  } else if (layer == 'sheng') {
    state.sm_values[key1] = sm2;
    state.sm_values[key2] = sm1;
    if (either_empty_key || either_has_vowel) {
      state.py_values[key1] = py2;
      state.py_values[key2] = py1;
    }
    if (either_has_symbol) {
      var tmp = state.symbol_tags[key1];
      state.symbol_tags[key1] = state.symbol_tags[key2];
      state.symbol_tags[key2] = tmp;
    }
  } else if (layer == 'both') {
    state.sm_values[key1] = sm2;
    state.sm_values[key2] = sm1;
    state.py_values[key1] = py2;
    state.py_values[key2] = py1;
    if (either_has_symbol) {
      var tmp = state.symbol_tags[key1];
      state.symbol_tags[key1] = state.symbol_tags[key2];
      state.symbol_tags[key2] = tmp;
    }
  }
}

function apply_swap_to_state_yun_only(state, key1, key2) {
  var py1 = state.py_values[key1];
  state.py_values[key1] = state.py_values[key2];
  state.py_values[key2] = py1;
}

function build_key_field_values_from_state(state, prefix) {
  var layout = get_layout();
  var key_values = {};
  var key_tokens = {};
  var source = prefix == 'py_' ? state.py_values : state.sm_values;
  for (var key in layout) {
    var value = (source[key] || '').trim();
    key_values[key] = value;
    var tokens = [];
    var parts = value.split(' ');
    for (var i = 0; i < parts.length; ++i) {
      var t = parts[i].trim().toLowerCase();
      if (t != '') {
        tokens.push(t);
      }
    }
    key_tokens[key] = tokens;
  }
  return { key_values: key_values, key_tokens: key_tokens };
}

function build_swap_context_from_state(layer, state) {
  var layout = get_layout();
  var prefix = (layer == 'yun') ? 'py_' : 'sm_';
  var fixed_keys = '';
  var label = (layer == 'yun') ? '[韵]' : '[声]';

  var field = build_key_field_values_from_state(state, prefix);
  var key_values = field.key_values;
  var key_tokens = field.key_tokens;
  var all_sheng_tokens_by_key = build_key_field_values_from_state(state, 'sm_').key_tokens;
  var all_yun_tokens_by_key = build_key_field_values_from_state(state, 'py_').key_tokens;

  var key_is_symbol_by_key = {};
  var key_is_empty_by_key = {};
  for (var key in layout) {
    key_is_symbol_by_key[key] = (state.symbol_tags[key] || '') != '';
    key_is_empty_by_key[key] = letters.includes(key) &&
      (all_sheng_tokens_by_key[key].length == 0 && all_yun_tokens_by_key[key].length == 0);
  }

  var yun_tokens_by_key = null;
  var yun_has_vowel_by_key = null;
  if (layer == 'sheng') {
    yun_tokens_by_key = build_key_field_values_from_state(state, 'py_').key_tokens;
    yun_has_vowel_by_key = {};
    for (var key in layout) {
      var has_vowel = false;
      var tokens = yun_tokens_by_key[key];
      for (var i = 0; i < tokens.length; ++i) {
        if (is_vowel_token(tokens[i])) {
          has_vowel = true;
          break;
        }
      }
      yun_has_vowel_by_key[key] = has_vowel;
    }
  } else if (layer == 'yun') {
    yun_has_vowel_by_key = {};
    for (var key in layout) {
      var has_vowel = false;
      var tokens = key_tokens[key];
      for (var i = 0; i < tokens.length; ++i) {
        if (is_vowel_token(tokens[i])) {
          has_vowel = true;
          break;
        }
      }
      yun_has_vowel_by_key[key] = has_vowel;
    }
  }

  return {
    layer: layer,
    layout: layout,
    prefix: prefix,
    fixed_keys: fixed_keys,
    label: label,
    key_values: key_values,
    key_tokens: key_tokens,
    all_sheng_tokens_by_key: all_sheng_tokens_by_key,
    all_yun_tokens_by_key: all_yun_tokens_by_key,
    key_is_symbol_by_key: key_is_symbol_by_key,
    key_is_empty_by_key: key_is_empty_by_key,
    yun_tokens_by_key: yun_tokens_by_key,
    yun_has_vowel_by_key: yun_has_vowel_by_key,
  };
}

function get_swap_token_sets(ctx, first, second) {
  var base_first_tokens = ctx.key_tokens[first];
  var base_second_tokens = ctx.key_tokens[second];
  var should_swap_all = ctx.key_is_symbol_by_key[first] || ctx.key_is_symbol_by_key[second] ||
    ctx.key_is_empty_by_key[first] || ctx.key_is_empty_by_key[second] ||
    (ctx.layer == 'yun' && (ctx.yun_has_vowel_by_key[first] || ctx.yun_has_vowel_by_key[second]));
  var first_tokens = should_swap_all ? ctx.all_sheng_tokens_by_key[first].concat(ctx.all_yun_tokens_by_key[first]) : base_first_tokens;
  var second_tokens = should_swap_all ? ctx.all_sheng_tokens_by_key[second].concat(ctx.all_yun_tokens_by_key[second]) : base_second_tokens;
  var first_yun_tokens = null;
  var second_yun_tokens = null;
  var include_yun_for_sheng_swap = false;
  if (!should_swap_all && ctx.layer == 'sheng' && (ctx.yun_has_vowel_by_key[first] || ctx.yun_has_vowel_by_key[second])) {
    include_yun_for_sheng_swap = true;
    first_yun_tokens = ctx.yun_tokens_by_key[first];
    second_yun_tokens = ctx.yun_tokens_by_key[second];
  }
  return {
    should_swap_all: should_swap_all,
    first_tokens: first_tokens,
    second_tokens: second_tokens,
    include_yun_for_sheng_swap: include_yun_for_sheng_swap,
    first_yun_tokens: first_yun_tokens,
    second_yun_tokens: second_yun_tokens,
  };
}

function get_swap_token_sets_yun_only(ctx, first, second) {
  if (ctx == null) {
    return { should_swap_all: false, first_tokens: [], second_tokens: [], include_yun_for_sheng_swap: false, first_yun_tokens: null, second_yun_tokens: null };
  }
  if ('aeoiuv'.includes(first) || 'aeoiuv'.includes(second)) {
    return { should_swap_all: false, first_tokens: [], second_tokens: [], include_yun_for_sheng_swap: false, first_yun_tokens: null, second_yun_tokens: null };
  }
  if (ctx.key_is_symbol_by_key[first] || ctx.key_is_symbol_by_key[second] ||
      ctx.key_is_empty_by_key[first] || ctx.key_is_empty_by_key[second]) {
    return { should_swap_all: false, first_tokens: [], second_tokens: [], include_yun_for_sheng_swap: false, first_yun_tokens: null, second_yun_tokens: null };
  }
  return {
    should_swap_all: false,
    first_tokens: ctx.key_tokens[first] || [],
    second_tokens: ctx.key_tokens[second] || [],
    include_yun_for_sheng_swap: false,
    first_yun_tokens: null,
    second_yun_tokens: null,
  };
}

var global_search_sa_undo_state = null;
var global_search_tabu_undo_state = null;
var undo_baseline_info = null;

function clear_global_search_sa_undo_state() {
  global_search_sa_undo_state = null;
  clear_undo_baseline_info('sa');
  var sa_undo_btn = document.getElementById('global-search-sa-undo');
  if (sa_undo_btn != null) sa_undo_btn.disabled = true;
}

function clear_global_search_tabu_undo_state() {
  global_search_tabu_undo_state = null;
  clear_undo_baseline_info('tabu');
  var tabu_undo_btn = document.getElementById('global-search-tabu-undo');
  if (tabu_undo_btn != null) tabu_undo_btn.disabled = true;
}

function set_undo_baseline_info(source) {
  var score = get_current_layout_score();
  if (score == null || isNaN(score)) {
    return;
  }
  undo_baseline_info = {
    source: source,
    ready: false,
    scheme_name: document.getElementById('scheme-name').value,
    layout_name: document.getElementById('layout-name').value,
    geometry: document.getElementById('geometry').value,
    score: score,
  };
}

function clear_undo_baseline_info(source) {
  if (undo_baseline_info == null) {
    return;
  }
  if (source == null || undo_baseline_info.source == source) {
    undo_baseline_info = null;
  }
}

function mark_undo_baseline_ready(source) {
  if (undo_baseline_info == null) {
    return;
  }
  if (undo_baseline_info.source == source) {
    undo_baseline_info.ready = true;
  }
}

function update_old_layout_score_ui() {
  var el = document.getElementById('score-old');
  if (el == null) {
    return;
  }
  if (undo_baseline_info != null) {
    if (undo_baseline_info.source == 'sa' && global_search_sa_undo_state == null) {
      undo_baseline_info = null;
    } else if (undo_baseline_info.source == 'tabu' && global_search_tabu_undo_state == null) {
      undo_baseline_info = null;
    }
  }
  if (undo_baseline_info == null || !undo_baseline_info.ready || undo_baseline_info.score == null || isNaN(undo_baseline_info.score)) {
    el.innerHTML = '';
    el.style.display = 'none';
    return;
  }
  var scheme_name = document.getElementById('scheme-name').value;
  var layout_name = document.getElementById('layout-name').value;
  var geometry = document.getElementById('geometry').value;
  if (undo_baseline_info.scheme_name != scheme_name ||
      undo_baseline_info.layout_name != layout_name ||
      undo_baseline_info.geometry != geometry) {
    el.style.display = 'none';
    return;
  }
  el.innerHTML = '（旧 ' + undo_baseline_info.score.toFixed(2) + '分）';
  el.style.display = 'inline';
}

function undo_global_search_sa() {
  if (global_search_sa_undo_state == null) {
    return;
  }
  write_keyboard_state(global_search_sa_undo_state);
  show_layout();
  update_symbol_placeholders();
  evaluate_current_scheme();
  clear_swap_selection();
  global_search_sa_undo_state = null;
  clear_undo_baseline_info('sa');
  update_old_layout_score_ui();
  var sa_undo_btn = document.getElementById('global-search-sa-undo');
  if (sa_undo_btn != null) sa_undo_btn.disabled = true;
}

function undo_global_search_tabu() {
  if (global_search_tabu_undo_state == null) {
    return;
  }
  write_keyboard_state(global_search_tabu_undo_state);
  show_layout();
  update_symbol_placeholders();
  evaluate_current_scheme();
  clear_swap_selection();
  global_search_tabu_undo_state = null;
  clear_undo_baseline_info('tabu');
  update_old_layout_score_ui();
  var tabu_undo_btn = document.getElementById('global-search-tabu-undo');
  if (tabu_undo_btn != null) tabu_undo_btn.disabled = true;
}

function apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens) {
  var seen = {};
  var first_tokens = swap_tokens.first_tokens || [];
  var second_tokens = swap_tokens.second_tokens || [];
  for (var i = 0; i < first_tokens.length; ++i) {
    seen[first_tokens[i]] = true;
  }
  for (var i = 0; i < second_tokens.length; ++i) {
    seen[second_tokens[i]] = true;
  }
  if (swap_tokens.include_yun_for_sheng_swap) {
    var first_yun_tokens = swap_tokens.first_yun_tokens || [];
    var second_yun_tokens = swap_tokens.second_yun_tokens || [];
    for (var i = 0; i < first_yun_tokens.length; ++i) {
      seen[first_yun_tokens[i]] = true;
    }
    for (var i = 0; i < second_yun_tokens.length; ++i) {
      seen[second_yun_tokens[i]] = true;
    }
  }
  for (var token in seen) {
    pinyin_map[token] = swap_all_keys(pinyin_map[token], first, second);
  }
}

function undo_swap_in_pinyin_map(pinyin_map, first, second, swap_tokens) {
  apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens);
}

function evaluate_pinyin_map(pinyin_map) {
  return fast_evaluate_scheme(pinyin_map, sheng_yun_freq) + fast_evaluate_scheme(pinyin_map, yun_sheng_freq);
}

function evaluate_pinyin_map_sheng_only(pinyin_map) {
  return fast_evaluate_scheme(pinyin_map, sheng_sheng_freq);
}

function get_sheng_only_state_from_keyboard() {
  var st = read_keyboard_state();
  var layout = get_layout();
  for (var key in layout) {
    st.py_values[key] = '';
    st.symbol_tags[key] = '';
  }
  return st;
}

function generate_sheng_only_swap_suggestions(baseline, total_hits, base_pinyin_map) {
  var epsilon = 1e-9;
  var state0 = get_sheng_only_state_from_keyboard();
  var ctx0 = build_swap_context_from_state('sheng', state0);
  var layout = ctx0.layout;
  var suggestions = [];
  var pinyin_map = clone_map(base_pinyin_map);
  for (var first in layout) {
    if (ctx0.fixed_keys.includes(first) || is_no_swap_key(first)) {
      continue;
    }
    for (var second in layout) {
      if (first >= second || ctx0.fixed_keys.includes(second) || is_no_swap_key(second)) {
        continue;
      }
      var swap_tokens = get_swap_token_sets(ctx0, first, second);
      if (swap_tokens.first_tokens.length == 0 && swap_tokens.second_tokens.length == 0) {
        continue;
      }
      apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens);
      var time = evaluate_pinyin_map_sheng_only(pinyin_map);
      undo_swap_in_pinyin_map(pinyin_map, first, second, swap_tokens);
      if (time < baseline - epsilon) {
        var score = (baseline - time) / total_hits * 100;
        var display1 = get_keycap_label_for_key(first) + '(' + ctx0.key_values[first] + ')';
        var display2 = get_keycap_label_for_key(second) + '(' + ctx0.key_values[second] + ')';
        suggestions.push({
          score: score,
          text: score.toFixed(3) + '｜ [声] 交换 ' + display1 + ' 和 ' + display2,
          value: 'sheng|' + first + '|' + second,
        });
      }
    }
  }
  return suggestions;
}

function generate_two_step_swap_suggestions_sheng_only(baseline, total_hits, base_pinyin_map) {
  var two_step = document.getElementById('improve-two-step');
  if (two_step == null || !two_step.checked) {
    return [];
  }
  var epsilon = 1e-9;

  var allow_worse_score = 0;
  var allow_worse_el = document.getElementById('improve-allow-worse');
  if (allow_worse_el != null) {
    allow_worse_score = parseFloat(allow_worse_el.value);
    if (isNaN(allow_worse_score) || allow_worse_score < 0) {
      allow_worse_score = 0;
    }
  }
  var beam_width = 12;
  var beam_el = document.getElementById('improve-beam-width');
  if (beam_el != null) {
    beam_width = parseInt(beam_el.value, 10);
    if (isNaN(beam_width) || beam_width < 1) {
      beam_width = 12;
    }
  }

  var allow_worse_time = allow_worse_score * total_hits / 100.0;
  var max_results = 80;

  var state0 = get_sheng_only_state_from_keyboard();
  var ctx0 = build_swap_context_from_state('sheng', state0);
  var layout = ctx0.layout;
  var pinyin_map0 = clone_map(base_pinyin_map);

  var first_moves = [];
  for (var first in layout) {
    if (ctx0.fixed_keys.includes(first) || is_no_swap_key(first)) {
      continue;
    }
    for (var second in layout) {
      if (first >= second || ctx0.fixed_keys.includes(second) || is_no_swap_key(second)) {
        continue;
      }
      var swap_tokens = get_swap_token_sets(ctx0, first, second);
      if (swap_tokens.first_tokens.length == 0 && swap_tokens.second_tokens.length == 0) {
        continue;
      }
      apply_swap_to_pinyin_map(pinyin_map0, first, second, swap_tokens);
      var time = evaluate_pinyin_map_sheng_only(pinyin_map0);
      undo_swap_in_pinyin_map(pinyin_map0, first, second, swap_tokens);
      if (time <= baseline + allow_worse_time) {
        first_moves.push({ first: first, second: second, time: time });
      }
    }
  }
  if (first_moves.length == 0) {
    return [];
  }
  first_moves.sort(function(a, b) { return a.time - b.time; });
  if (first_moves.length > beam_width) {
    first_moves = first_moves.slice(0, beam_width);
  }

  var suggestions = [];
  var seen = {};
  for (var i = 0; i < first_moves.length; ++i) {
    var move1 = first_moves[i];
    var state1 = clone_keyboard_state(state0);
    apply_swap_to_state(state1, 'sheng', move1.first, move1.second);

    var scheme1 = get_scheme_from_state(state1);
    var pinyin_map1 = read_pinyin_map_from_scheme(scheme1).pinyin_map;
    var ctx1 = build_swap_context_from_state('sheng', state1);
    var layout2 = ctx1.layout;
    var pinyin_map_work = clone_map(pinyin_map1);

    for (var first2 in layout2) {
      if (ctx1.fixed_keys.includes(first2) || is_no_swap_key(first2)) {
        continue;
      }
      for (var second2 in layout2) {
        if (first2 >= second2 || ctx1.fixed_keys.includes(second2) || is_no_swap_key(second2)) {
          continue;
        }
        if ((first2 == move1.first && second2 == move1.second) || (first2 == move1.second && second2 == move1.first)) {
          continue;
        }
        var swap2_tokens = get_swap_token_sets(ctx1, first2, second2);
        if (swap2_tokens.first_tokens.length == 0 && swap2_tokens.second_tokens.length == 0) {
          continue;
        }
        apply_swap_to_pinyin_map(pinyin_map_work, first2, second2, swap2_tokens);
        var time2 = evaluate_pinyin_map_sheng_only(pinyin_map_work);
        undo_swap_in_pinyin_map(pinyin_map_work, first2, second2, swap2_tokens);
        if (time2 < baseline - epsilon) {
          var score = (baseline - time2) / total_hits * 100;
          var value = 'seq|sheng|' + move1.first + '|' + move1.second + '|sheng|' + first2 + '|' + second2;
          if (seen[value]) {
            continue;
          }
          seen[value] = true;
          var display11 = get_keycap_label_for_key(move1.first) + '(' + ctx0.key_values[move1.first] + ')';
          var display12 = get_keycap_label_for_key(move1.second) + '(' + ctx0.key_values[move1.second] + ')';
          var display21 = get_keycap_label_for_key(first2) + '(' + ctx1.key_values[first2] + ')';
          var display22 = get_keycap_label_for_key(second2) + '(' + ctx1.key_values[second2] + ')';
          suggestions.push({
            score: score,
            text: score.toFixed(3) + '｜ [2步] [声] 交换 ' + display11 + ' 和 ' + display12 +
              '；[声] 交换 ' + display21 + ' 和 ' + display22,
            value: value,
          });
        }
      }
    }
  }

  suggestions.sort(function(a, b) { return b.score - a.score; });
  if (suggestions.length > max_results) {
    suggestions = suggestions.slice(0, max_results);
  }
  return suggestions;
}

function generate_two_step_swap_suggestions(mode, baseline, total_hits, base_pinyin_map) {
  var two_step = document.getElementById('improve-two-step');
  if (two_step == null || !two_step.checked) {
    return [];
  }
  var epsilon = 1e-9;

  var allow_worse_score = 0;
  var allow_worse_el = document.getElementById('improve-allow-worse');
  if (allow_worse_el != null) {
    allow_worse_score = parseFloat(allow_worse_el.value);
    if (isNaN(allow_worse_score) || allow_worse_score < 0) {
      allow_worse_score = 0;
    }
  }
  var beam_width = 12;
  var beam_el = document.getElementById('improve-beam-width');
  if (beam_el != null) {
    beam_width = parseInt(beam_el.value, 10);
    if (isNaN(beam_width) || beam_width < 1) {
      beam_width = 12;
    }
  }

  var allow_worse_time = allow_worse_score * total_hits / 100.0;
  var max_results = 80;
  var state0 = read_keyboard_state();

  var layers = [];
  if (mode == 'yun') layers = ['yun'];
  else if (mode == 'sheng') layers = ['sheng'];
  else layers = ['yun', 'sheng'];

  var first_moves = [];
  for (var li = 0; li < layers.length; ++li) {
    var layer = layers[li];
    var ctx0 = build_swap_context_from_state(layer, state0);
    var layout = ctx0.layout;
    var pinyin_map = clone_map(base_pinyin_map);

    for (var first in layout) {
      if (ctx0.fixed_keys.includes(first)) {
        continue;
      }
      if (is_no_swap_key(first)) {
        continue;
      }
      for (var second in layout) {
        if (first >= second || ctx0.fixed_keys.includes(second)) {
          continue;
        }
        if (is_no_swap_key(second)) {
          continue;
        }

        var swap_tokens = get_swap_token_sets(ctx0, first, second);
        if (swap_tokens.first_tokens.length == 0 && swap_tokens.second_tokens.length == 0) {
          continue;
        }

        apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens);
        var time = evaluate_pinyin_map(pinyin_map);
        undo_swap_in_pinyin_map(pinyin_map, first, second, swap_tokens);

        if (time <= baseline + allow_worse_time) {
          first_moves.push({
            layer: layer,
            first: first,
            second: second,
            time: time,
          });
        }
      }
    }
  }

  if (first_moves.length == 0) {
    return [];
  }

  first_moves.sort(function(a, b) { return a.time - b.time; });
  if (first_moves.length > beam_width) {
    first_moves = first_moves.slice(0, beam_width);
  }

  var suggestions = [];
  var seen = {};

  for (var i = 0; i < first_moves.length; ++i) {
    var move1 = first_moves[i];
    var state1 = clone_keyboard_state(state0);
    apply_swap_to_state(state1, move1.layer, move1.first, move1.second);

    var scheme1 = get_scheme_from_state(state1);
    var pinyin_map1 = read_pinyin_map_from_scheme(scheme1).pinyin_map;

    for (var lj = 0; lj < layers.length; ++lj) {
      var layer2 = layers[lj];
      var ctx1 = build_swap_context_from_state(layer2, state1);
      var layout2 = ctx1.layout;
      var pinyin_map_work = clone_map(pinyin_map1);

      for (var first2 in layout2) {
        if (ctx1.fixed_keys.includes(first2)) {
          continue;
        }
        if (is_no_swap_key(first2)) {
          continue;
        }
        for (var second2 in layout2) {
          if (first2 >= second2 || ctx1.fixed_keys.includes(second2)) {
            continue;
          }
          if (is_no_swap_key(second2)) {
            continue;
          }
          if (first2 == move1.first && second2 == move1.second && layer2 == move1.layer) {
            continue;
          }
          if (first2 == move1.second && second2 == move1.first && layer2 == move1.layer) {
            continue;
          }

          var swap2_tokens = get_swap_token_sets(ctx1, first2, second2);
          if (swap2_tokens.first_tokens.length == 0 && swap2_tokens.second_tokens.length == 0) {
            continue;
          }

          apply_swap_to_pinyin_map(pinyin_map_work, first2, second2, swap2_tokens);
          var time2 = evaluate_pinyin_map(pinyin_map_work);
          undo_swap_in_pinyin_map(pinyin_map_work, first2, second2, swap2_tokens);

          if (time2 < baseline - epsilon) {
            var score = (baseline - time2) / total_hits * 100;
            var value = 'seq|' + move1.layer + '|' + move1.first + '|' + move1.second + '|' + layer2 + '|' + first2 + '|' + second2;
            if (seen[value]) {
              continue;
            }
            seen[value] = true;

            var label1 = move1.layer == 'yun' ? '[韵]' : '[声]';
            var ctx0_for_display = build_swap_context_from_state(move1.layer, state0);
            var display11 = get_keycap_label_for_key(move1.first) + '(' + ctx0_for_display.key_values[move1.first] + ')';
            var display12 = get_keycap_label_for_key(move1.second) + '(' + ctx0_for_display.key_values[move1.second] + ')';
            var label2 = layer2 == 'yun' ? '[韵]' : '[声]';
            var display21 = get_keycap_label_for_key(first2) + '(' + ctx1.key_values[first2] + ')';
            var display22 = get_keycap_label_for_key(second2) + '(' + ctx1.key_values[second2] + ')';

            suggestions.push({
              score: score,
              text: score.toFixed(3) + '｜ [2步] ' + label1 + ' 交换 ' + display11 + ' 和 ' + display12 +
                '；' + label2 + ' 交换 ' + display21 + ' 和 ' + display22,
              value: value,
            });
          }
        }
      }
    }
  }

  suggestions.sort(function(a, b) { return b.score - a.score; });
  if (suggestions.length > max_results) {
    suggestions = suggestions.slice(0, max_results);
  }
  return suggestions;
}

function generate_swap_suggestions(layer, baseline, total_hits, base_pinyin_map) {
  var layout = get_layout();
  var prefix = (layer == 'yun') ? 'py_' : 'sm_';
  var label = (layer == 'yun') ? '[韵]' : '[声]';
  var epsilon = 1e-9;

  var field = get_key_field_values(prefix);
  var key_values = field.key_values;
  var key_tokens = field.key_tokens;
  var all_sheng_tokens_by_key = get_key_field_values('sm_').key_tokens;
  var all_yun_tokens_by_key = get_key_field_values('py_').key_tokens;
  var key_is_symbol_by_key = {};
  var key_is_empty_by_key = {};
  for (var key in layout) {
    key_is_symbol_by_key[key] = get_symbol_tag_for_key(key) != '';
    key_is_empty_by_key[key] = letters.includes(key) &&
      (all_sheng_tokens_by_key[key].length == 0 && all_yun_tokens_by_key[key].length == 0);
  }
  var yun_tokens_by_key = null;
  var yun_has_vowel_by_key = null;
  if (layer == 'sheng') {
    yun_tokens_by_key = get_key_field_values('py_').key_tokens;
    yun_has_vowel_by_key = {};
    for (var key in layout) {
      var has_vowel = false;
      var tokens = yun_tokens_by_key[key];
      for (var i = 0; i < tokens.length; ++i) {
        if (is_vowel_token(tokens[i])) {
          has_vowel = true;
          break;
        }
      }
      yun_has_vowel_by_key[key] = has_vowel;
    }
  } else if (layer == 'yun') {
    yun_has_vowel_by_key = {};
    for (var key in layout) {
      var has_vowel = false;
      var tokens = key_tokens[key];
      for (var i = 0; i < tokens.length; ++i) {
        if (is_vowel_token(tokens[i])) {
          has_vowel = true;
          break;
        }
      }
      yun_has_vowel_by_key[key] = has_vowel;
    }
  }

  var pinyin_map = clone_map(base_pinyin_map);
  var suggestions = [];

  for (var first in layout) {
    if (is_no_swap_key(first)) {
      continue;
    }
    var base_first_tokens = key_tokens[first];
    for (var second in layout) {
      if (first >= second) {
        continue;
      }
      if (is_no_swap_key(second)) {
        continue;
      }
      var base_second_tokens = key_tokens[second];
      var should_swap_all = key_is_symbol_by_key[first] || key_is_symbol_by_key[second] ||
        key_is_empty_by_key[first] || key_is_empty_by_key[second] ||
        (layer == 'yun' && (yun_has_vowel_by_key[first] || yun_has_vowel_by_key[second]));
      var first_tokens = should_swap_all ? all_sheng_tokens_by_key[first].concat(all_yun_tokens_by_key[first]) : base_first_tokens;
      var second_tokens = should_swap_all ? all_sheng_tokens_by_key[second].concat(all_yun_tokens_by_key[second]) : base_second_tokens;
      if (first_tokens.length == 0 && second_tokens.length == 0) {
        continue;
      }

      var affected = {};
      for (var i = 0; i < first_tokens.length; ++i) affected[first_tokens[i]] = true;
      for (var i = 0; i < second_tokens.length; ++i) affected[second_tokens[i]] = true;
      if (!should_swap_all && layer == 'sheng' && (yun_has_vowel_by_key[first] || yun_has_vowel_by_key[second])) {
        var first_yun_tokens = yun_tokens_by_key[first];
        var second_yun_tokens = yun_tokens_by_key[second];
        for (var i = 0; i < first_yun_tokens.length; ++i) affected[first_yun_tokens[i]] = true;
        for (var i = 0; i < second_yun_tokens.length; ++i) affected[second_yun_tokens[i]] = true;
      }
      for (var token in affected) {
        pinyin_map[token] = swap_all_keys(pinyin_map[token], first, second);
      }

      var time = fast_evaluate_scheme(pinyin_map, sheng_yun_freq)
        + fast_evaluate_scheme(pinyin_map, yun_sheng_freq);
      if (time < baseline - epsilon) {
        var score = (baseline - time) / total_hits * 100;
        var display1 = get_keycap_label_for_key(first) + '(' + key_values[first] + ')';
        var display2 = get_keycap_label_for_key(second) + '(' + key_values[second] + ')';
        suggestions.push({
          score: score,
          text: score.toFixed(3) + '｜ ' + label + ' 交换 ' + display1 + ' 和 ' + display2,
          value: layer + '|' + first + '|' + second,
        });
      }

      for (var token in affected) {
        pinyin_map[token] = swap_all_keys(pinyin_map[token], first, second);
      }
    }
  }
  return suggestions;
}

function generate_full_pinyin_swap_suggestions(baseline, total_hits, base_pinyin_map, token_pair_freq) {
  var epsilon = 1e-9;
  var state0 = read_keyboard_state();
  var ctx0 = build_swap_context_from_state('yun', state0);
  var layout = ctx0.layout;
  var suggestions = [];
  var pinyin_map = clone_map(base_pinyin_map);

  function letter_tokens_on_key_in_state(state, key) {
    var out = [];
    var tokens = String(((state || {}).py_values || {})[key] || '').trim().toLowerCase().split(' ');
    for (var i = 0; i < tokens.length; ++i) {
      var t = String(tokens[i] || '').toLowerCase();
      if (t.length == 1 && letters.includes(t)) {
        out.push(t);
      }
    }
    return out;
  }

  for (var first in layout) {
    if (is_no_swap_key(first)) {
      continue;
    }
    for (var second in layout) {
      if (first >= second) {
        continue;
      }
      if (is_no_swap_key(second)) {
        continue;
      }
      var has_symbol = String((state0.symbol_tags || {})[first] || '') != '' ||
        String((state0.symbol_tags || {})[second] || '') != '';
      var first_tokens = letter_tokens_on_key_in_state(state0, first);
      var second_tokens = letter_tokens_on_key_in_state(state0, second);
      if (!has_symbol && first_tokens.length == 0 && second_tokens.length == 0) {
        continue;
      }
      var swap_tokens = {
        should_swap_all: false,
        first_tokens: first_tokens,
        second_tokens: second_tokens,
        include_yun_for_sheng_swap: false,
        first_yun_tokens: null,
        second_yun_tokens: null,
      };
      apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens);
      apply_swap_to_state(state0, 'yun', first, second);
      var time = fast_evaluate_full_pinyin_tokens(pinyin_map, state0, token_pair_freq);
      apply_swap_to_state(state0, 'yun', first, second);
      undo_swap_in_pinyin_map(pinyin_map, first, second, swap_tokens);
      if (time < baseline - epsilon) {
        var score = (baseline - time) / total_hits * 100;
        var display1 = get_keycap_label_for_key(first) + '(' + ctx0.key_values[first] + ')';
        var display2 = get_keycap_label_for_key(second) + '(' + ctx0.key_values[second] + ')';
        suggestions.push({
          score: score,
          text: score.toFixed(3) + '｜ [全拼/英文] 交换 ' + display1 + ' 和 ' + display2,
          value: 'yun|' + first + '|' + second,
        });
      }
    }
  }
  return suggestions;
}

function improve_scheme() {
  var scroll_x = window.scrollX || 0;
  var scroll_y = window.scrollY || 0;
  stat_pinyin();

  var scheme_name = document.getElementById('scheme-name').value;
  var scheme = get_scheme_from_keyboard();
  var pinyin_map = read_pinyin_map_from_scheme(scheme).pinyin_map;
  var baseline = 0;
  var total_hits = 0;
  var mode = document.getElementById('improve-mode').value;
  var suggestions_list = [];

  if (scheme_name == '全拼/英文') {
    ensure_full_pinyin_letters_on_keyboard();
    var use_irrational_pinyin = document.getElementById('enable-irrational-pinyin').checked;
    var irrational_char_pinyin = use_irrational_pinyin ? get_irrational_char_pinyin() : {};
    var token_pair_freq = build_full_pinyin_token_pair_freq_from_input_text(use_irrational_pinyin, irrational_char_pinyin);
    total_hits = total_pairs(token_pair_freq);
    if (total_hits <= 0) {
      alert('当前文本没有可用于全拼/英文优化的按键序列。');
      return;
    }
    baseline = fast_evaluate_full_pinyin_tokens(pinyin_map, read_keyboard_state(), token_pair_freq);
    suggestions_list = generate_full_pinyin_swap_suggestions(baseline, total_hits, pinyin_map, token_pair_freq);
  } else {
  var is_sheng_mode = (scheme_name == '声母模式');
  if (is_sheng_mode) {
    baseline = fast_evaluate_scheme(pinyin_map, sheng_sheng_freq);
    total_hits = total_pairs(sheng_sheng_freq);
    mode = 'sheng';
    suggestions_list = generate_sheng_only_swap_suggestions(baseline, total_hits, pinyin_map)
      .concat(generate_two_step_swap_suggestions_sheng_only(baseline, total_hits, pinyin_map));
  } else {
    baseline = fast_evaluate_scheme(pinyin_map, sheng_yun_freq) + fast_evaluate_scheme(pinyin_map, yun_sheng_freq);
    total_hits = total_pairs(sheng_yun_freq) + total_pairs(yun_sheng_freq);

    if (mode == 'yun') {
      suggestions_list = generate_swap_suggestions('yun', baseline, total_hits, pinyin_map);
    } else if (mode == 'sheng') {
      suggestions_list = generate_swap_suggestions('sheng', baseline, total_hits, pinyin_map);
    } else {
      suggestions_list = generate_swap_suggestions('yun', baseline, total_hits, pinyin_map)
        .concat(generate_swap_suggestions('sheng', baseline, total_hits, pinyin_map));
    }
    var two_step_suggestions = generate_two_step_swap_suggestions(mode, baseline, total_hits, pinyin_map);
    if (two_step_suggestions.length > 0) {
      var verify_limit = 40;
      if (two_step_suggestions.length > verify_limit) {
        two_step_suggestions = two_step_suggestions.slice(0, verify_limit);
      }
      var state0 = read_keyboard_state();
      var baseline_score = compute_layout_score_for_scheme_with_symbol_tags(
        scheme_name, get_scheme_from_state(state0), state0.symbol_tags);
      if (baseline_score != null) {
        var filtered = [];
        var epsilon_score = 1e-6;
        for (var i = 0; i < two_step_suggestions.length; ++i) {
          var s = two_step_suggestions[i] || {};
          var value = String(s.value || '');
          var parts = value.split('|');
          if (parts.length < 7 || parts[0] != 'seq') {
            continue;
          }
          var st = clone_keyboard_state(state0);
          apply_swap_to_state(st, parts[1], parts[2], parts[3]);
          apply_swap_to_state(st, parts[4], parts[5], parts[6]);
          var sc = compute_layout_score_for_scheme_with_symbol_tags(
            scheme_name, get_scheme_from_state(st), st.symbol_tags);
          if (sc != null && sc > baseline_score + epsilon_score) {
            filtered.push(s);
          }
        }
        two_step_suggestions = filtered;
      }
    }
    suggestions_list = suggestions_list.concat(two_step_suggestions);
  }
  }

  var suggestions = document.getElementById('suggestion');
  var num_options = suggestions.length;
  for (var i = num_options; i > 0; --i) {
    suggestions.remove(i - 1);
  }

  if (suggestions_list.length > 0) {
    suggestions_list.sort(function(a, b) { return b.score - a.score; });
    for (var i = 0; i < suggestions_list.length; ++i) {
      var option = document.createElement('option');
      option.text = suggestions_list[i].text;
      option.value = suggestions_list[i].value;
      suggestions.add(option);
    }
  } else {
    var option = document.createElement('option');
    option.text = '该方案已是局部最优（单步/两步邻域均无提升）';
    option.value = '';
    suggestions.add(option);
  }
  show_element('suggestion');
  var improve_btn = document.getElementById('improve');
  if (improve_btn != null && improve_btn.focus) {
    try {
      improve_btn.focus({ preventScroll: true });
    } catch (e) {
      improve_btn.focus();
    }
  }
  requestAnimationFrame(function() {
    window.scrollTo(scroll_x, scroll_y);
  });
}

function global_search_sa() {
  stat_pinyin();

  var scheme_name = document.getElementById('scheme-name').value;
  if (scheme_name == '全拼/英文') {
    global_search_sa_full_pinyin();
    return;
  }
  var mode = document.getElementById('improve-mode').value;
  var is_sheng_mode = (scheme_name == '声母模式');
  if (is_sheng_mode) {
    mode = 'sheng';
  }
  var yun_only = false;
  var yun_only_el = document.getElementById('sa-yun-only');
  if (!is_sheng_mode && yun_only_el != null && yun_only_el.checked) {
    yun_only = true;
  }

  var steps = 8000;
  var steps_el = document.getElementById('sa-steps');
  if (steps_el != null) {
    steps = parseInt(steps_el.value, 10);
    if (isNaN(steps) || steps < 100) {
      steps = 8000;
    }
  }
  var restarts = 4;
  var restarts_el = document.getElementById('sa-restarts');
  if (restarts_el != null) {
    restarts = parseInt(restarts_el.value, 10);
    if (isNaN(restarts) || restarts < 1) {
      restarts = 4;
    }
  }
  var temp_ratio = 0.012;
  var temp_el = document.getElementById('sa-temp');
  if (temp_el != null) {
    temp_ratio = parseFloat(temp_el.value);
    if (isNaN(temp_ratio) || temp_ratio <= 0) {
      temp_ratio = 0.012;
    }
  }

  var scheme = get_scheme_from_keyboard();
  var pinyin_map0 = read_pinyin_map_from_scheme(scheme).pinyin_map;
  var state0 = is_sheng_mode ? get_sheng_only_state_from_keyboard() : read_keyboard_state();

  var baseline = 0;
  var total_hits = 0;
  if (is_sheng_mode) {
    baseline = evaluate_pinyin_map_sheng_only(pinyin_map0);
    total_hits = total_pairs(sheng_sheng_freq);
  } else {
    baseline = evaluate_pinyin_map(pinyin_map0);
    total_hits = total_pairs(sheng_yun_freq) + total_pairs(yun_sheng_freq);
  }
  if (baseline == null || isNaN(baseline) || baseline <= 0) {
    alert('无法计算基准分数，无法开始搜索。');
    return;
  }

  var layers = [];
  if (yun_only) layers = ['yun'];
  else if (mode == 'yun') layers = ['yun'];
  else if (mode == 'sheng') layers = ['sheng'];
  else layers = ['yun', 'sheng'];

  var improve_btn = document.getElementById('improve');
  var sa_btn = document.getElementById('global-search-sa');
  var sa_undo_btn = document.getElementById('global-search-sa-undo');
  var tabu_btn = document.getElementById('global-search-tabu');
  clear_global_search_tabu_undo_state();
  if (improve_btn != null) improve_btn.disabled = true;
  if (sa_btn != null) sa_btn.disabled = true;
  if (sa_undo_btn != null) sa_undo_btn.disabled = true;
  if (tabu_btn != null) tabu_btn.disabled = true;
  global_search_sa_undo_state = clone_keyboard_state(state0);
  set_undo_baseline_info('sa');
  update_old_layout_score_ui();

  var layout = get_layout();
  var key_list = [];
  for (var k in layout) {
    if (!is_no_swap_key(k)) {
      key_list.push(k);
    }
  }

  var best_cost = baseline;
  var best_state = clone_keyboard_state(state0);
  var epsilon = 1e-9;
  var t0 = baseline * temp_ratio;
  var t_end = t0 * 0.001;
  var chunk = 300;

  function random_int(n) {
    return Math.floor(Math.random() * n);
  }

  function pick_move(ctx) {
    var tries = 30;
    while (tries-- > 0) {
      var i = random_int(key_list.length);
      var j = random_int(key_list.length);
      if (i == j) continue;
      var first = key_list[i];
      var second = key_list[j];
      if (first > second) {
        var tmp = first;
        first = second;
        second = tmp;
      }
      if (ctx.fixed_keys.includes(first) || ctx.fixed_keys.includes(second)) {
        continue;
      }
      var swap_tokens = (yun_only && ctx.layer == 'yun') ? get_swap_token_sets_yun_only(ctx, first, second) : get_swap_token_sets(ctx, first, second);
      if ((swap_tokens.first_tokens || []).length == 0 && (swap_tokens.second_tokens || []).length == 0) {
        continue;
      }
      return { first: first, second: second, swap_tokens: swap_tokens };
    }
    return null;
  }

  function exp_accept(delta, t) {
    if (delta <= 0) return true;
    if (t <= 0) return false;
    return Math.random() < Math.exp(-delta / t);
  }

  function update_suggestion_status(text) {
    var suggestions = document.getElementById('suggestion');
    if (suggestions == null) return;
    if (suggestions.options.length == 0) {
      var opt = document.createElement('option');
      opt.text = text;
      opt.value = '';
      suggestions.add(opt);
    } else {
      suggestions.options[0].text = text;
    }
    show_element('suggestion');
  }

  var restart_idx = 0;
  function run_one_restart(done_cb) {
    var state = clone_keyboard_state(state0);
    var pinyin_map = clone_map(pinyin_map0);
    var cost = baseline;

    if (restart_idx > 0) {
      var shake = 24;
      for (var s = 0; s < shake; ++s) {
        var layer0 = layers[random_int(layers.length)];
        var ctx0 = build_swap_context_from_state(layer0, state);
        var mv0 = pick_move(ctx0);
        if (mv0 == null) continue;
        apply_swap_to_pinyin_map(pinyin_map, mv0.first, mv0.second, mv0.swap_tokens);
        if (yun_only && layer0 == 'yun') apply_swap_to_state_yun_only(state, mv0.first, mv0.second);
        else apply_swap_to_state(state, layer0, mv0.first, mv0.second);
      }
      cost = is_sheng_mode ? evaluate_pinyin_map_sheng_only(pinyin_map) : evaluate_pinyin_map(pinyin_map);
    }

    var i = 0;
    function step_chunk() {
      var stop = Math.min(steps, i + chunk);
      for (; i < stop; ++i) {
        var layer = layers[random_int(layers.length)];
        var ctx = build_swap_context_from_state(layer, state);
        var mv = pick_move(ctx);
        if (mv == null) continue;

        apply_swap_to_pinyin_map(pinyin_map, mv.first, mv.second, mv.swap_tokens);
        var new_cost = is_sheng_mode ? evaluate_pinyin_map_sheng_only(pinyin_map) : evaluate_pinyin_map(pinyin_map);
        var delta = new_cost - cost;
        var t = t0 * Math.pow(t_end / t0, i / Math.max(1, steps - 1));
        if (exp_accept(delta, t)) {
          if (yun_only && layer == 'yun') apply_swap_to_state_yun_only(state, mv.first, mv.second);
          else apply_swap_to_state(state, layer, mv.first, mv.second);
          cost = new_cost;
          if (cost < best_cost - epsilon) {
            best_cost = cost;
            best_state = clone_keyboard_state(state);
          }
        } else {
          undo_swap_in_pinyin_map(pinyin_map, mv.first, mv.second, mv.swap_tokens);
        }
      }

      var score = (baseline - best_cost) / total_hits * 100;
      update_suggestion_status('全局搜索（模拟退火）进行中：重启 ' + (restart_idx + 1) + '/' + restarts +
        '，迭代 ' + i + '/' + steps + '，当前最好提升 ' + score.toFixed(3) + ' 分');

      if (i < steps) {
        setTimeout(step_chunk, 0);
      } else {
        done_cb();
      }
    }
    step_chunk();
  }

  function run_all_restarts() {
    if (restart_idx >= restarts) {
      if (improve_btn != null) improve_btn.disabled = false;
      if (sa_btn != null) sa_btn.disabled = false;
      if (tabu_btn != null) tabu_btn.disabled = false;
      if (sa_undo_btn != null) sa_undo_btn.disabled = false;
      mark_undo_baseline_ready('sa');
      update_old_layout_score_ui();

      var score = (baseline - best_cost) / total_hits * 100;
      if (best_cost < baseline - epsilon) {
        write_keyboard_state(best_state);
        show_layout();
        update_symbol_placeholders();
        evaluate_current_scheme();
        update_suggestion_status('全局搜索完成：已应用最好结果（提升 ' + score.toFixed(3) + ' 分）');
      } else {
        update_suggestion_status('全局搜索完成：未找到更优布局（可尝试增大迭代次数/重启次数/温度）');
      }
      return;
    }
    run_one_restart(function() {
      restart_idx++;
      setTimeout(run_all_restarts, 0);
    });
  }

  update_suggestion_status('全局搜索（模拟退火）开始…');
  run_all_restarts();
}

function global_search_sa_full_pinyin() {
  ensure_full_pinyin_letters_on_keyboard();

  var use_irrational_pinyin = document.getElementById('enable-irrational-pinyin').checked;
  var irrational_char_pinyin = use_irrational_pinyin ? get_irrational_char_pinyin() : {};
  var token_pair_freq = build_full_pinyin_token_pair_freq_from_input_text(use_irrational_pinyin, irrational_char_pinyin);
  var total_hits = total_pairs(token_pair_freq);
  if (total_hits <= 0) {
    alert('当前文本没有可用于全拼/英文优化的按键序列。');
    return;
  }

  var steps = 8000;
  var steps_el = document.getElementById('sa-steps');
  if (steps_el != null) {
    steps = parseInt(steps_el.value, 10);
    if (isNaN(steps) || steps < 100) {
      steps = 8000;
    }
  }
  var restarts = 4;
  var restarts_el = document.getElementById('sa-restarts');
  if (restarts_el != null) {
    restarts = parseInt(restarts_el.value, 10);
    if (isNaN(restarts) || restarts < 1) {
      restarts = 4;
    }
  }
  var temp_ratio = 0.012;
  var temp_el = document.getElementById('sa-temp');
  if (temp_el != null) {
    temp_ratio = parseFloat(temp_el.value);
    if (isNaN(temp_ratio) || temp_ratio <= 0) {
      temp_ratio = 0.012;
    }
  }

  var scheme = get_scheme_from_keyboard();
  var pinyin_map0 = read_pinyin_map_from_scheme(scheme).pinyin_map;
  var state0 = read_keyboard_state();
  var baseline = fast_evaluate_full_pinyin_tokens(pinyin_map0, state0, token_pair_freq);
  if (baseline == null || isNaN(baseline) || baseline <= 0) {
    alert('无法计算基准分数，无法开始搜索。');
    return;
  }

  var improve_btn = document.getElementById('improve');
  var sa_btn = document.getElementById('global-search-sa');
  var sa_undo_btn = document.getElementById('global-search-sa-undo');
  var tabu_btn = document.getElementById('global-search-tabu');

  var layout = get_layout();
  var key_list = [];
  for (var k in layout) {
    if (!is_no_swap_key(k)) {
      key_list.push(k);
    }
  }
  if (key_list.length < 2) {
    if (improve_btn != null) improve_btn.disabled = false;
    if (sa_btn != null) sa_btn.disabled = false;
    alert('可用于交换的按键不足，无法开始搜索。');
    return;
  }

  clear_global_search_tabu_undo_state();
  if (improve_btn != null) improve_btn.disabled = true;
  if (sa_btn != null) sa_btn.disabled = true;
  if (sa_undo_btn != null) sa_undo_btn.disabled = true;
  if (tabu_btn != null) tabu_btn.disabled = true;
  global_search_sa_undo_state = clone_keyboard_state(state0);
  set_undo_baseline_info('sa');
  update_old_layout_score_ui();

  var best_cost = baseline;
  var best_state = clone_keyboard_state(state0);
  var epsilon = 1e-9;
  var t0 = baseline * temp_ratio;
  var t_end = t0 * 0.001;
  var chunk = 300;

  function random_int(n) {
    return Math.floor(Math.random() * n);
  }

  function pick_move(state) {
    for (var tries = 0; tries < 60; ++tries) {
      var i1 = random_int(key_list.length);
      var i2 = random_int(key_list.length - 1);
      if (i2 >= i1) i2++;
      var first = key_list[i1];
      var second = key_list[i2];
      if (first > second) {
        var tmp = first;
        first = second;
        second = tmp;
      }
      var t1 = String((state.py_values[first] || '')).trim().toLowerCase().split(' ');
      var t2 = String((state.py_values[second] || '')).trim().toLowerCase().split(' ');
      var first_tokens = [];
      var second_tokens = [];
      for (var a = 0; a < t1.length; ++a) {
        var x = t1[a].trim();
        if (x.length == 1 && letters.includes(x)) first_tokens.push(x);
      }
      for (var b = 0; b < t2.length; ++b) {
        var y = t2[b].trim();
        if (y.length == 1 && letters.includes(y)) second_tokens.push(y);
      }
      var has_symbol = String((state.symbol_tags || {})[first] || '') != '' ||
        String((state.symbol_tags || {})[second] || '') != '';
      if (!has_symbol && first_tokens.length == 0 && second_tokens.length == 0) {
        continue;
      }
      return {
        first: first,
        second: second,
        swap_tokens: {
          should_swap_all: false,
          first_tokens: first_tokens,
          second_tokens: second_tokens,
          include_yun_for_sheng_swap: false,
          first_yun_tokens: null,
          second_yun_tokens: null,
        },
      };
    }
    return null;
  }

  function exp_accept(delta, t) {
    if (delta <= 0) return true;
    if (t <= 0) return false;
    return Math.random() < Math.exp(-delta / t);
  }

  function update_suggestion_status(text) {
    var suggestions = document.getElementById('suggestion');
    if (suggestions == null) return;
    if (suggestions.options.length == 0) {
      var opt = document.createElement('option');
      opt.text = text;
      opt.value = '';
      suggestions.add(opt);
    } else {
      suggestions.options[0].text = text;
    }
    show_element('suggestion');
  }

  var restart_idx = 0;
  function run_one_restart(done_cb) {
    var state = clone_keyboard_state(state0);
    var pinyin_map = clone_map(pinyin_map0);
    var cost = baseline;

    if (restart_idx > 0) {
      var shake = 24;
      for (var s = 0; s < shake; ++s) {
        var mv0 = pick_move(state);
        if (mv0 == null) continue;
        apply_swap_to_pinyin_map(pinyin_map, mv0.first, mv0.second, mv0.swap_tokens);
        apply_swap_to_state(state, 'yun', mv0.first, mv0.second);
      }
      cost = fast_evaluate_full_pinyin_tokens(pinyin_map, state, token_pair_freq);
    }

    var i = 0;
    function step_chunk() {
      var stop = Math.min(steps, i + chunk);
      for (; i < stop; ++i) {
        var mv = pick_move(state);
        if (mv == null) continue;
        apply_swap_to_pinyin_map(pinyin_map, mv.first, mv.second, mv.swap_tokens);
        apply_swap_to_state(state, 'yun', mv.first, mv.second);
        var new_cost = fast_evaluate_full_pinyin_tokens(pinyin_map, state, token_pair_freq);
        var delta = new_cost - cost;
        var t = t0 * Math.pow(t_end / t0, i / Math.max(1, steps - 1));
        if (exp_accept(delta, t)) {
          cost = new_cost;
          if (cost < best_cost - epsilon) {
            best_cost = cost;
            best_state = clone_keyboard_state(state);
          }
        } else {
          apply_swap_to_state(state, 'yun', mv.first, mv.second);
          undo_swap_in_pinyin_map(pinyin_map, mv.first, mv.second, mv.swap_tokens);
        }
      }

      var score = (baseline - best_cost) / total_hits * 100;
      update_suggestion_status('全局搜索（模拟退火｜全拼/英文）进行中：重启 ' + (restart_idx + 1) + '/' + restarts +
        '，迭代 ' + i + '/' + steps + '，当前最好提升 ' + score.toFixed(3) + ' 分');

      if (i < steps) {
        setTimeout(step_chunk, 0);
      } else {
        done_cb();
      }
    }
    step_chunk();
  }

  function run_all_restarts() {
    if (restart_idx >= restarts) {
      if (improve_btn != null) improve_btn.disabled = false;
      if (sa_btn != null) sa_btn.disabled = false;
      if (tabu_btn != null) tabu_btn.disabled = false;
      if (sa_undo_btn != null) sa_undo_btn.disabled = false;
      mark_undo_baseline_ready('sa');
      update_old_layout_score_ui();

      var score = (baseline - best_cost) / total_hits * 100;
      if (best_cost < baseline - epsilon) {
        write_keyboard_state(best_state);
        show_layout();
        update_symbol_placeholders();
        evaluate_current_scheme();
        update_suggestion_status('全局搜索完成：已应用最好结果（提升 ' + score.toFixed(3) + ' 分）');
      } else {
        update_suggestion_status('全局搜索完成：未找到更优布局（可尝试增大迭代次数/重启次数/温度）');
      }
      return;
    }
    run_one_restart(function() {
      restart_idx++;
      setTimeout(run_all_restarts, 0);
    });
  }

  update_suggestion_status('全局搜索（模拟退火｜全拼/英文）开始…');
  run_all_restarts();
}

function global_search_tabu_full_pinyin() {
  ensure_full_pinyin_letters_on_keyboard();

  var use_irrational_pinyin = document.getElementById('enable-irrational-pinyin').checked;
  var irrational_char_pinyin = use_irrational_pinyin ? get_irrational_char_pinyin() : {};
  var token_pair_freq = build_full_pinyin_token_pair_freq_from_input_text(use_irrational_pinyin, irrational_char_pinyin);
  var total_hits = total_pairs(token_pair_freq);
  if (total_hits <= 0) {
    alert('当前文本没有可用于全拼/英文优化的按键序列。');
    return;
  }

  var steps = 1200;
  var steps_el = document.getElementById('tabu-steps');
  if (steps_el != null) {
    steps = parseInt(steps_el.value, 10);
    if (isNaN(steps) || steps < 50) {
      steps = 1200;
    }
  }
  var tenure = 30;
  var tenure_el = document.getElementById('tabu-tenure');
  if (tenure_el != null) {
    tenure = parseInt(tenure_el.value, 10);
    if (isNaN(tenure) || tenure < 1) {
      tenure = 30;
    }
  }
  var candidate_limit = 160;
  var cand_el = document.getElementById('tabu-candidates');
  if (cand_el != null) {
    candidate_limit = parseInt(cand_el.value, 10);
    if (isNaN(candidate_limit) || candidate_limit < 0) {
      candidate_limit = 160;
    }
  }

  var scheme = get_scheme_from_keyboard();
  var pinyin_map0 = read_pinyin_map_from_scheme(scheme).pinyin_map;
  var state0 = read_keyboard_state();
  var baseline = fast_evaluate_full_pinyin_tokens(pinyin_map0, state0, token_pair_freq);
  if (baseline == null || isNaN(baseline) || baseline <= 0) {
    alert('无法计算基准分数，无法开始搜索。');
    return;
  }

  var improve_btn = document.getElementById('improve');
  var sa_btn = document.getElementById('global-search-sa');
  var tabu_btn = document.getElementById('global-search-tabu');
  var tabu_undo_btn = document.getElementById('global-search-tabu-undo');

  var layout = get_layout();
  var key_list = [];
  for (var k in layout) {
    if (!is_no_swap_key(k)) {
      key_list.push(k);
    }
  }
  if (key_list.length < 2) {
    if (improve_btn != null) improve_btn.disabled = false;
    if (sa_btn != null) sa_btn.disabled = false;
    if (tabu_btn != null) tabu_btn.disabled = false;
    alert('可用于交换的按键不足，无法开始搜索。');
    return;
  }

  clear_global_search_sa_undo_state();
  if (improve_btn != null) improve_btn.disabled = true;
  if (sa_btn != null) sa_btn.disabled = true;
  if (tabu_btn != null) tabu_btn.disabled = true;
  if (tabu_undo_btn != null) tabu_undo_btn.disabled = true;
  global_search_tabu_undo_state = clone_keyboard_state(state0);
  set_undo_baseline_info('tabu');
  update_old_layout_score_ui();

  function random_int(n) {
    return Math.floor(Math.random() * n);
  }

  function update_suggestion_status(text) {
    var suggestions = document.getElementById('suggestion');
    if (suggestions == null) return;
    if (suggestions.options.length == 0) {
      var opt = document.createElement('option');
      opt.text = text;
      opt.value = '';
      suggestions.add(opt);
    } else {
      suggestions.options[0].text = text;
    }
    show_element('suggestion');
  }

  function letter_tokens_on_key(state, key) {
    var raw = String((state.py_values[key] || '')).trim().toLowerCase();
    var parts = raw.split(' ');
    var out = [];
    for (var i = 0; i < parts.length; ++i) {
      var t = parts[i].trim();
      if (t.length == 1 && letters.includes(t)) {
        out.push(t);
      }
    }
    return out;
  }

  function apply_swap_inplace(state, pinyin_map, first, second) {
    var swap_tokens = {
      should_swap_all: false,
      first_tokens: letter_tokens_on_key(state, first),
      second_tokens: letter_tokens_on_key(state, second),
      include_yun_for_sheng_swap: false,
      first_yun_tokens: null,
      second_yun_tokens: null,
    };
    apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens);
    apply_swap_to_state(state, 'yun', first, second);
    return swap_tokens;
  }

  function undo_swap_inplace(state, pinyin_map, first, second, swap_tokens) {
    apply_swap_to_state(state, 'yun', first, second);
    undo_swap_in_pinyin_map(pinyin_map, first, second, swap_tokens);
  }

  var best_cost = baseline;
  var best_state = clone_keyboard_state(state0);
  var best_iter = 0;
  var epsilon = 1e-9;
  var tabu = {};

  var state = clone_keyboard_state(state0);
  var pinyin_map = clone_map(pinyin_map0);
  var cost = baseline;

  function all_pairs() {
    var pairs = [];
    for (var i = 0; i < key_list.length; ++i) {
      for (var j = i + 1; j < key_list.length; ++j) {
        pairs.push([key_list[i], key_list[j]]);
      }
    }
    return pairs;
  }

  function sample_pairs(limit) {
    if (limit == 0 || limit >= (key_list.length * (key_list.length - 1)) / 2) {
      return all_pairs();
    }
    var pairs = [];
    for (var i = 0; i < limit; ++i) {
      var i1 = random_int(key_list.length);
      var i2 = random_int(key_list.length - 1);
      if (i2 >= i1) i2++;
      var a = key_list[i1];
      var b = key_list[i2];
      if (a > b) {
        var tmp = a;
        a = b;
        b = tmp;
      }
      pairs.push([a, b]);
    }
    return pairs;
  }

  var i = 0;
  var chunk = 60;
  function step_chunk() {
    var stop = Math.min(steps, i + chunk);
    for (; i < stop; ++i) {
      var candidates = sample_pairs(candidate_limit);
      var best_move = null;
      var best_move_cost = null;
      for (var c = 0; c < candidates.length; ++c) {
        var pair = candidates[c];
        var first = pair[0];
        var second = pair[1];
        var key = first + '|' + second;
        var is_tabu = (tabu[key] != null && tabu[key] > i);

        var swap_tokens = {
          should_swap_all: false,
          first_tokens: letter_tokens_on_key(state, first),
          second_tokens: letter_tokens_on_key(state, second),
          include_yun_for_sheng_swap: false,
          first_yun_tokens: null,
          second_yun_tokens: null,
        };
        var has_symbol = String((state.symbol_tags || {})[first] || '') != '' ||
          String((state.symbol_tags || {})[second] || '') != '';
        if (!has_symbol && (swap_tokens.first_tokens || []).length == 0 && (swap_tokens.second_tokens || []).length == 0) {
          continue;
        }
        apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens);
        apply_swap_to_state(state, 'yun', first, second);
        var new_cost = fast_evaluate_full_pinyin_tokens(pinyin_map, state, token_pair_freq);
        apply_swap_to_state(state, 'yun', first, second);
        undo_swap_in_pinyin_map(pinyin_map, first, second, swap_tokens);

        if (is_tabu && new_cost >= best_cost - epsilon) {
          continue;
        }
        if (best_move_cost == null || new_cost < best_move_cost) {
          best_move_cost = new_cost;
          best_move = { first: first, second: second };
        }
      }

      if (best_move == null) {
        continue;
      }

      var swap_tokens_applied = apply_swap_inplace(state, pinyin_map, best_move.first, best_move.second);
      cost = fast_evaluate_full_pinyin_tokens(pinyin_map, state, token_pair_freq);
      tabu[best_move.first + '|' + best_move.second] = i + tenure;

      if (cost < best_cost - epsilon) {
        best_cost = cost;
        best_state = clone_keyboard_state(state);
        best_iter = i;
      }
    }

    var score = (baseline - best_cost) / total_hits * 100;
    update_suggestion_status('全局搜索（禁忌｜全拼/英文）进行中：迭代 ' + i + '/' + steps +
      '，当前最好提升 ' + score.toFixed(3) + ' 分（最好出现在第 ' + best_iter + ' 步）');

    if (i < steps) {
      setTimeout(step_chunk, 0);
      return;
    }

    if (improve_btn != null) improve_btn.disabled = false;
    if (sa_btn != null) sa_btn.disabled = false;
    if (tabu_btn != null) tabu_btn.disabled = false;
    if (tabu_undo_btn != null) tabu_undo_btn.disabled = false;
    mark_undo_baseline_ready('tabu');
    update_old_layout_score_ui();

    var final_score = (baseline - best_cost) / total_hits * 100;
    if (best_cost < baseline - epsilon) {
      write_keyboard_state(best_state);
      show_layout();
      update_symbol_placeholders();
      evaluate_current_scheme();
      update_suggestion_status('全局搜索完成：已应用最好结果（提升 ' + final_score.toFixed(3) + ' 分）');
    } else {
      update_suggestion_status('全局搜索完成：未找到更优布局（可尝试增大步数/候选数量/禁忌长度）');
    }
  }

  update_suggestion_status('全局搜索（禁忌｜全拼/英文）开始…');
  step_chunk();
}

function global_search_tabu() {
  stat_pinyin();

  var scheme_name = document.getElementById('scheme-name').value;
  if (scheme_name == '全拼/英文') {
    global_search_tabu_full_pinyin();
    return;
  }
  var mode = document.getElementById('improve-mode').value;
  var is_sheng_mode = (scheme_name == '声母模式');
  if (is_sheng_mode) {
    mode = 'sheng';
  }
  var yun_only = false;
  var yun_only_el = document.getElementById('tabu-yun-only');
  if (!is_sheng_mode && yun_only_el != null && yun_only_el.checked) {
    yun_only = true;
  }

  var steps = 1200;
  var steps_el = document.getElementById('tabu-steps');
  if (steps_el != null) {
    steps = parseInt(steps_el.value, 10);
    if (isNaN(steps) || steps < 50) {
      steps = 1200;
    }
  }
  var tenure = 30;
  var tenure_el = document.getElementById('tabu-tenure');
  if (tenure_el != null) {
    tenure = parseInt(tenure_el.value, 10);
    if (isNaN(tenure) || tenure < 1) {
      tenure = 30;
    }
  }
  var candidate_limit = 160;
  var cand_el = document.getElementById('tabu-candidates');
  if (cand_el != null) {
    candidate_limit = parseInt(cand_el.value, 10);
    if (isNaN(candidate_limit) || candidate_limit < 0) {
      candidate_limit = 160;
    }
  }

  var scheme = get_scheme_from_keyboard();
  var pinyin_map0 = read_pinyin_map_from_scheme(scheme).pinyin_map;
  var state0 = is_sheng_mode ? get_sheng_only_state_from_keyboard() : read_keyboard_state();

  var baseline = 0;
  var total_hits = 0;
  if (is_sheng_mode) {
    baseline = evaluate_pinyin_map_sheng_only(pinyin_map0);
    total_hits = total_pairs(sheng_sheng_freq);
  } else {
    baseline = evaluate_pinyin_map(pinyin_map0);
    total_hits = total_pairs(sheng_yun_freq) + total_pairs(yun_sheng_freq);
  }
  if (baseline == null || isNaN(baseline) || baseline <= 0) {
    alert('无法计算基准分数，无法开始搜索。');
    return;
  }

  var layers = [];
  if (yun_only) layers = ['yun'];
  else if (mode == 'yun') layers = ['yun'];
  else if (mode == 'sheng') layers = ['sheng'];
  else layers = ['yun', 'sheng'];

  var improve_btn = document.getElementById('improve');
  var sa_btn = document.getElementById('global-search-sa');
  var tabu_btn = document.getElementById('global-search-tabu');
  var sa_undo_btn = document.getElementById('global-search-sa-undo');
  var tabu_undo_btn = document.getElementById('global-search-tabu-undo');
  clear_global_search_sa_undo_state();
  if (improve_btn != null) improve_btn.disabled = true;
  if (sa_btn != null) sa_btn.disabled = true;
  if (tabu_btn != null) tabu_btn.disabled = true;
  if (sa_undo_btn != null) sa_undo_btn.disabled = true;
  if (tabu_undo_btn != null) tabu_undo_btn.disabled = true;
  global_search_tabu_undo_state = read_keyboard_state();
  set_undo_baseline_info('tabu');
  update_old_layout_score_ui();

  var layout = get_layout();
  var key_list = [];
  for (var k in layout) {
    if (!is_no_swap_key(k)) {
      key_list.push(k);
    }
  }

  function random_int(n) {
    return Math.floor(Math.random() * n);
  }

  function update_suggestion_status(text) {
    var suggestions = document.getElementById('suggestion');
    if (suggestions == null) return;
    if (suggestions.options.length == 0) {
      var opt = document.createElement('option');
      opt.text = text;
      opt.value = '';
      suggestions.add(opt);
    } else {
      suggestions.options[0].text = text;
    }
    show_element('suggestion');
  }

  function canon_move_key(layer, first, second) {
    if (first > second) {
      var t = first;
      first = second;
      second = t;
    }
    return layer + '|' + first + '|' + second;
  }

  function enumerate_pairs(ctx, cb) {
    for (var i = 0; i < key_list.length; ++i) {
      var first = key_list[i];
      if (ctx.fixed_keys.includes(first)) continue;
      for (var j = i + 1; j < key_list.length; ++j) {
        var second = key_list[j];
        if (ctx.fixed_keys.includes(second)) continue;
        cb(first, second);
      }
    }
  }

  function sample_pairs(ctx, count, cb) {
    var tries = Math.max(count * 4, 80);
    var seen = {};
    while (count > 0 && tries-- > 0) {
      var i = random_int(key_list.length);
      var j = random_int(key_list.length);
      if (i == j) continue;
      var first = key_list[i];
      var second = key_list[j];
      if (first > second) {
        var t = first;
        first = second;
        second = t;
      }
      if (ctx.fixed_keys.includes(first) || ctx.fixed_keys.includes(second)) continue;
      var key = first + '|' + second;
      if (seen[key]) continue;
      seen[key] = true;
      cb(first, second);
      count--;
    }
  }

  var epsilon = 1e-9;
  var state = clone_keyboard_state(state0);
  var pinyin_map = clone_map(pinyin_map0);
  var cost = baseline;
  var best_cost = baseline;
  var best_state = clone_keyboard_state(state0);

  var tabu_until = {};
  function is_tabu(move_key, step) {
    var until = tabu_until[move_key] || 0;
    return until > step;
  }
  function add_tabu(move_key, step) {
    tabu_until[move_key] = step + tenure;
  }

  function eval_cost(map) {
    return is_sheng_mode ? evaluate_pinyin_map_sheng_only(map) : evaluate_pinyin_map(map);
  }

  var step_idx = 0;
  var chunk_steps = (candidate_limit == 0) ? 2 : 20;

  function step_chunk() {
    var stop = Math.min(steps, step_idx + chunk_steps);
    for (; step_idx < stop; ++step_idx) {
      var best_move = null;
      var best_move_cost = null;
      var best_move_layer = null;
      var best_move_key = '';

      for (var li = 0; li < layers.length; ++li) {
        var layer = layers[li];
        var ctx = build_swap_context_from_state(layer, state);
        var consider_pair = function(first, second) {
          var move_key = canon_move_key(layer, first, second);
          var swap_tokens = (yun_only && layer == 'yun') ? get_swap_token_sets_yun_only(ctx, first, second) : get_swap_token_sets(ctx, first, second);
          if ((swap_tokens.first_tokens || []).length == 0 && (swap_tokens.second_tokens || []).length == 0) {
            return;
          }
          apply_swap_to_pinyin_map(pinyin_map, first, second, swap_tokens);
          var new_cost = eval_cost(pinyin_map);
          undo_swap_in_pinyin_map(pinyin_map, first, second, swap_tokens);

          var tabu = is_tabu(move_key, step_idx);
          var aspiration = new_cost < best_cost - epsilon;
          if (tabu && !aspiration) {
            return;
          }
          if (best_move_cost == null || new_cost < best_move_cost - epsilon) {
            best_move_cost = new_cost;
            best_move = { first: first, second: second, swap_tokens: swap_tokens };
            best_move_layer = layer;
            best_move_key = move_key;
          }
        };

        if (candidate_limit == 0) {
          enumerate_pairs(ctx, consider_pair);
        } else {
          sample_pairs(ctx, candidate_limit, consider_pair);
        }
      }

      if (best_move == null || best_move_layer == null) {
        break;
      }

      apply_swap_to_pinyin_map(pinyin_map, best_move.first, best_move.second, best_move.swap_tokens);
      if (yun_only && best_move_layer == 'yun') apply_swap_to_state_yun_only(state, best_move.first, best_move.second);
      else apply_swap_to_state(state, best_move_layer, best_move.first, best_move.second);
      cost = best_move_cost;
      add_tabu(best_move_key, step_idx);
      if (cost < best_cost - epsilon) {
        best_cost = cost;
        best_state = clone_keyboard_state(state);
      }
    }

    var score = (baseline - best_cost) / total_hits * 100;
    update_suggestion_status('全局搜索（禁忌）进行中：迭代 ' + step_idx + '/' + steps +
      '，当前最好提升 ' + score.toFixed(3) + ' 分');

    if (step_idx < steps) {
      setTimeout(step_chunk, 0);
      return;
    }

    if (improve_btn != null) improve_btn.disabled = false;
    if (sa_btn != null) sa_btn.disabled = false;
    if (tabu_btn != null) tabu_btn.disabled = false;
    if (tabu_undo_btn != null) tabu_undo_btn.disabled = false;
    mark_undo_baseline_ready('tabu');
    update_old_layout_score_ui();

    var final_score = (baseline - best_cost) / total_hits * 100;
    if (best_cost < baseline - epsilon) {
      write_keyboard_state(best_state);
      show_layout();
      update_symbol_placeholders();
      evaluate_current_scheme();
      update_suggestion_status('全局搜索完成：已应用最好结果（提升 ' + final_score.toFixed(3) + ' 分）');
    } else {
      update_suggestion_status('全局搜索完成：未找到更优布局（可尝试增大迭代次数/禁忌长度/候选数量）');
    }
  }

  update_suggestion_status('全局搜索（禁忌）开始…');
  setTimeout(step_chunk, 0);
}

function apply_swap_to_keyboard(layer, key1, key2, should_evaluate) {
  if (should_evaluate === undefined) {
    should_evaluate = true;
  }
  var layout = get_layout();
  if (is_no_swap_key(key1)) {
    return;
  }
  var x1 = layout[key1][0];
  var y1 = layout[key1][1];

  if (is_no_swap_key(key2)) {
    return;
  }
  var x2 = layout[key2][0];
  var y2 = layout[key2][1];

  var sm_id_1 = 'sm_' + y1 + x1;
  var sm_id_2 = 'sm_' + y2 + x2;
  var py_id_1 = 'py_' + y1 + x1;
  var py_id_2 = 'py_' + y2 + x2;
  var sm1 = document.getElementById(sm_id_1).value.trim();
  var sm2 = document.getElementById(sm_id_2).value.trim();
  var py1 = document.getElementById(py_id_1).value.trim();
  var py2 = document.getElementById(py_id_2).value.trim();
  var either_has_symbol = get_symbol_tag_for_key(key1) != '' || get_symbol_tag_for_key(key2) != '';
  var either_empty_key = either_has_symbol ||
    (letters.includes(key1) && sm1 == '' && py1 == '') ||
    (letters.includes(key2) && sm2 == '' && py2 == '');
  var either_has_vowel = split_yun_value(py1).vowels.length > 0 || split_yun_value(py2).vowels.length > 0;

  if (layer == 'yun') {
    if (either_empty_key || either_has_vowel) {
      document.getElementById(sm_id_1).value = sm2;
      document.getElementById(sm_id_2).value = sm1;
      document.getElementById(py_id_1).value = py2;
      document.getElementById(py_id_2).value = py1;
      if (either_has_symbol) {
        swap_symbol_tags(key1, key2);
      }
    } else {
      document.getElementById(py_id_1).value = py2;
      document.getElementById(py_id_2).value = py1;
    }
  } else if (layer == 'sheng') {
    document.getElementById(sm_id_1).value = sm2;
    document.getElementById(sm_id_2).value = sm1;
    if (either_empty_key || either_has_vowel) {
      document.getElementById(py_id_1).value = py2;
      document.getElementById(py_id_2).value = py1;
    }
    if (either_has_symbol) {
      swap_symbol_tags(key1, key2);
    }
  } else if (layer == 'both') {
    document.getElementById(sm_id_1).value = sm2;
    document.getElementById(sm_id_2).value = sm1;
    document.getElementById(py_id_1).value = py2;
    document.getElementById(py_id_2).value = py1;
    if (either_has_symbol) {
      swap_symbol_tags(key1, key2);
    }
  }

  show_layout();
  update_symbol_placeholders();
  if (should_evaluate) {
    evaluate_current_scheme();
  }
}

var last_applied_suggestion_value = '';
var suggestion_try_in_progress = false;

function set_suggestion_status(text, busy) {
  var el = document.getElementById('improve-status');
  if (el == null) {
    return;
  }
  el.textContent = busy ? '正在清除错误建议…' : '';
}

function improve_and_try_suggestion() {
  improve_scheme();
  if (suggestion_try_in_progress) {
    return;
  }
  set_suggestion_status('', true);
  setTimeout(function() {
    try_suggestions_from_top();
  }, 0);
}

function try_suggestions_from_top() {
  var suggestions = document.getElementById('suggestion');
  if (suggestions == null) {
    return;
  }
  if (suggestion_try_in_progress) {
    return;
  }

  suggestion_try_in_progress = true;
  var epsilon_score = 1e-6;
  evaluate_current_scheme();
  var score_before = get_current_layout_score();
  var removed_count = 0;

  function finish(text) {
    suggestion_try_in_progress = false;
    set_suggestion_status('', false);
  }

  function step() {
    if (suggestions.options.length <= 0) {
      if (removed_count > 0) {
        finish('已试完：删除 ' + removed_count + ' 条无提升建议');
      } else {
        finish('没有可用建议');
      }
      return;
    }

    suggestions.selectedIndex = 0;
    var suggestion_value = suggestions.value;
    if (suggestion_value == null || suggestion_value == '') {
      finish('');
      return;
    }

    var option_text = '';
    try {
      option_text = String((suggestions.options[0] || {}).text || '');
    } catch (e) {
      option_text = '';
    }
    set_suggestion_status('', true);

    setTimeout(function() {
      var parts = suggestion_value.split('|');
      if (parts.length < 3) {
        finish('');
        return;
      }

      var improved = false;
      if (parts[0] == 'seq') {
        if (parts.length < 7) {
          finish('');
          return;
        }
        apply_swap_to_keyboard(parts[1], parts[2], parts[3], false);
        apply_swap_to_keyboard(parts[4], parts[5], parts[6], false);
        evaluate_current_scheme();
        var score_after = get_current_layout_score();
        improved = (score_before != null && score_after != null && score_after > score_before + epsilon_score);
        apply_swap_to_keyboard(parts[4], parts[5], parts[6], false);
        apply_swap_to_keyboard(parts[1], parts[2], parts[3], false);
        evaluate_current_scheme();
      } else {
        apply_swap_to_keyboard(parts[0], parts[1], parts[2], false);
        evaluate_current_scheme();
        var score_after = get_current_layout_score();
        improved = (score_before != null && score_after != null && score_after > score_before + epsilon_score);
        apply_swap_to_keyboard(parts[0], parts[1], parts[2], false);
        evaluate_current_scheme();
      }

      if (improved) {
        suggestions.selectedIndex = 0;
        finish('');
        return;
      }

      remove_selected_suggestion_option();
      removed_count += 1;
      setTimeout(step, 0);
    }, 0);
  }

  step();
}

function remove_selected_suggestion_option() {
  var suggestions = document.getElementById('suggestion');
  if (suggestions == null) {
    return;
  }
  var idx = suggestions.selectedIndex;
  if (idx < 0 || idx >= suggestions.options.length) {
    return;
  }
  suggestions.remove(idx);
  if (suggestions.options.length == 0) {
    hide_element('suggestion');
    return;
  }
  suggestions.selectedIndex = Math.min(idx, suggestions.options.length - 1);
}

function apply_suggestion() {
  var suggestions = document.getElementById('suggestion');
  if (suggestions == null) {
    return;
  }

  set_suggestion_status('', false);
  var suggestion_value = suggestions.value;
  if (suggestion_value == null || suggestion_value == '') {
    return;
  }
  var is_undo = suggestion_value == last_applied_suggestion_value;
  var epsilon_score = 1e-6;
  var parts = suggestion_value.split('|');
  if (parts.length < 3) {
    return;
  }
  if (!is_undo) {
    evaluate_current_scheme();
  }
  var score_before = get_current_layout_score();
  if (parts[0] == 'seq') {
    if (parts.length < 7) {
      return;
    }
    if (is_undo) {
      apply_swap_to_keyboard(parts[4], parts[5], parts[6], false);
      apply_swap_to_keyboard(parts[1], parts[2], parts[3], false);
      evaluate_current_scheme();
      last_applied_suggestion_value = '';
      return;
    }
    apply_swap_to_keyboard(parts[1], parts[2], parts[3], false);
    apply_swap_to_keyboard(parts[4], parts[5], parts[6], false);
    evaluate_current_scheme();
    var score_after = get_current_layout_score();
    if (score_before != null && score_after != null && score_after <= score_before + epsilon_score) {
      apply_swap_to_keyboard(parts[4], parts[5], parts[6], false);
      apply_swap_to_keyboard(parts[1], parts[2], parts[3], false);
      evaluate_current_scheme();
      last_applied_suggestion_value = '';
      remove_selected_suggestion_option();
      alert('该两步建议在全文评测中未提升，已自动撤销并删除。');
      return;
    }
    last_applied_suggestion_value = suggestion_value;
    return;
  }
  if (is_undo) {
    apply_swap_to_keyboard(parts[0], parts[1], parts[2], false);
    evaluate_current_scheme();
    last_applied_suggestion_value = '';
    return;
  }
  apply_swap_to_keyboard(parts[0], parts[1], parts[2], false);
  evaluate_current_scheme();
  var score_after = get_current_layout_score();
  if (score_before != null && score_after != null && score_after <= score_before + epsilon_score) {
    apply_swap_to_keyboard(parts[0], parts[1], parts[2], false);
    evaluate_current_scheme();
    last_applied_suggestion_value = '';
    remove_selected_suggestion_option();
    alert('该建议在全文评测中未提升，已自动撤销并删除。');
    return;
  }
  last_applied_suggestion_value = suggestion_value;
}

function export_scheme() {
  var ime_engine = document.getElementById('ime-engine');
  if (ime_engine != null) {
    ime_engine.value = 'none';
  }
  return;
  var scheme_name = document.getElementById('scheme-name').value;
  var scheme = get_scheme_from_keyboard();
  var pinyin_map = read_pinyin_map_from_scheme(scheme).pinyin_map;

  var ime_engine = document.getElementById('ime-engine');
  var title = scheme_name + ' - ' +
    ime_engine.options[ime_engine.selectedIndex].text;

  var config;
  switch (ime_engine.value) {
    case 'fcitx':
      if (check_key_map(pinyin_map)) {
        download("sp.dat", export_scheme_for_fcitx());
      }
      break;
    case 'rime':
      if (check_key_map(pinyin_map)) {
        download("double_pinyin.schema.yaml", export_scheme_for_rime(false));
      }
      break;
    case 'rime_smart':
      if (check_key_map_with_strokes(pinyin_map)) {
        download("double_pinyin_stroke.dict.yaml", export_stroke_dict_for_rime());
        download("double_pinyin_stroke.schema.yaml", export_stroke_scheme_for_rime());
        download("double_pinyin_smart.schema.yaml", export_scheme_for_rime(true));
      }
      break;
  }
  document.getElementById('ime-engine').value = 'none';
}

function download(filename, text) {
  if (text == '') {
    return;
  }

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
