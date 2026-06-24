import fs from 'fs';
import path from 'path';

const DEFAULT_CONFIG = {
  // 1. Alias to source path mappings for AST imports resolution
  aliasToSrc: {
    '@components':  'app/components',
    '@hooks':       'app/hooks',
    '@store':       'app/store',
    '@stores':      'app/store',
    '@services':    'services',
    '@lib':         'lib',
    '@utils':       'app/utils',
    '@config':      'app/config',
    '@contexts':    'app/contexts',
    '@app/types':   'app/types',
    '@feature':     'app/features',
    '@features':    'app/features',
    '@assets':      'assets',
  },
  
  // 2. Stop words for search keyword extraction
  stopWords: [
    'fix', 'fixing', 'refactor', 'refactoring', 'optimize', 'update', 'upgrade',
    'add', 'remove', 'delete', 'create', 'implement', 'change', 'modify',
    'bug', 'feature', 'task', 'issue', 'error', 'index', 'spec', 'done',
    'src', 'app', 'components', 'pages', 'protected', 'page',
    'hooks', 'store', 'stores', 'services', 'utils', 'types', 'config', 'lib',
    'elements', 'layouts', 'shared', 'providers', 'contexts', 'icons',
    'api', 'data', 'load', 'fetch', 'get', 'set', 'list', 'type', 'props',
    'root', 'cause', 'analysis', 'module', 'response', 'patch', 'undefined', 'logic',
    'function', 'class', 'interface', 'object', 'array', 'string', 'number',
    'và', 'của', 'trong', 'khi', 'với', 'cho', 'từ', 'tại', 'theo',
    'một', 'các', 'những', 'này', 'đó', 'có', 'không', 'được', 'là',
    'phân', 'tích', 'tính', 'năng', 'toán', 'thực', 'hiện', 'kiến', 'trúc',
    'yêu', 'cầu', 'kỹ', 'thuật', 'giải', 'pháp', 'vấn', 'đề', 'lỗi',
    'cập', 'nhật', 'thêm', 'xóa', 'sửa', 'đổi', 'mới', 'cũ',
    'the', 'a', 'an', 'in', 'of', 'to', 'and', 'or', 'for',
    'use', 'using', 'used', 'when', 'with', 'from', 'that', 'this',
    'file', 'code', 'review', 'strategy', 'tsx', 'scss', 'css',
    'overall', 'assessment', 'additional', 'summary', 'detailed', 'description',
    'section', 'step', 'phase', 'stage', 'plan', 'note', 'result',
  ],

  // 3. Skip segments for path-based keyword extraction
  skipSegments: [
    'src', 'app', 'components', 'pages', 'protected-page', 'hooks',
    'store', 'stores', 'services', 'utils', 'types', 'config', 'lib',
    'elements', 'layouts', 'shared', 'providers', 'contexts', 'icons',
    'index', 'tsx', 'ts', 'js', 'jsx', 'scss',
  ],

  // 4. Feature keywords to automatically infer features from task name
  featureKeywords: [
    'auth', 'todo', 'birthday', 'broadcast', 'call', 'group', 'message', 
    'search', 'jitsi', 'sticker', 'user', 'chat', 'integration', 'confirm', 
    'setting', 'virtuoso', 'onboard', 'privacy', 'avatar', 'dnd', 'emoji'
  ],

  // 5. Synonym mapping for keyword comparison
  synonymMap: {
    'avatar': 'avatar', 'image': 'avatar', 'photo': 'avatar', 'picture': 'avatar', 'icon': 'avatar', 'logo': 'avatar', 'banner': 'avatar',
    'auth': 'auth', 'login': 'auth', 'signin': 'auth', 'signup': 'auth', 'signout': 'auth', 'logout': 'auth', 'register': 'auth', 'token': 'auth', 'session': 'auth', 'credential': 'auth',
    'todo': 'todo', 'task': 'todo', 'checklist': 'todo', 'job': 'todo', 'work': 'todo', 'subtask': 'todo', 'myday': 'todo',
    'chat': 'chat', 'message': 'chat', 'msg': 'chat', 'conversation': 'chat', 'room': 'chat', 'channel': 'chat', 'thread': 'chat', 'text': 'chat',
    'notification': 'notification', 'push': 'notification', 'fcm': 'notification', 'alert': 'notification', 'toast': 'notification', 'popup': 'notification',
    'call': 'call', 'video': 'call', 'audio': 'call', 'voice': 'call', 'meeting': 'call', 'conference': 'call',
    'setting': 'setting', 'settings': 'setting', 'option': 'setting', 'options': 'setting', 'config': 'setting', 'configuration': 'setting', 'preference': 'setting', 'preferences': 'setting',
    'group': 'group', 'room': 'group', 'team': 'group', 'members': 'group', 'member': 'group',
    'search': 'search', 'find': 'search', 'query': 'search', 'filter': 'search',
    'upload': 'upload', 'download': 'upload', 'file': 'upload', 'attachment': 'upload', 'media': 'upload', 'import': 'upload', 'export': 'upload'
  },

  // 6. Core business concepts to boost semantic similarity score
  coreBusinessConcepts: [
    'avatar', 'auth', 'todo', 'chat', 'notification', 'call', 'setting', 'jitsi', 
    'emoji', 'sticker', 'onboard', 'privacy', 'dnd', 'group', 'broadcast', 'search'
  ],

  // 7. Regex patterns for simple tweaks
  tweakPatterns: [
    '\\b(typo|label|text|i18n|translate|locale|lang|message-text|translations|wording|spelling)\\b',
    '\\b(format|prettier|eslint|comment|docstring|lint)\\b',
    '\\b(style|css|scss|color|spacing|padding|margin|align|border|font|height|width|layout-tweak|ui-adjust)\\b',
    '\\b(console|log|debug|verbose)\\b',
    '\\b(readme|todo-comment|documentation|changelog)\\b',
    '\\b(cleanup|clean-up|refactor-style|remove-unused-style)\\b'
  ],

  // 8. Directories to ignore during workspace search/analysis
  ignoredDirs: [
    'node_modules', '.git', 'dist', 'build', '.next',
    '.agents', 'sk-specs', 'coverage', '.cache', 'public',
  ],

  // 9. Source extensions to look for when crawling src/ directory
  sourceExtensions: ['.ts', '.tsx', '.js', '.jsx']
};

export function getConfig() {
  const configPath = path.join(process.cwd(), 'sk-specs.config.json');
  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }
  try {
    const fileContent = fs.readFileSync(configPath, 'utf8');
    const userConfig = JSON.parse(fileContent);
    return {
      aliasToSrc: { ...DEFAULT_CONFIG.aliasToSrc, ...userConfig.aliasToSrc },
      stopWords: userConfig.stopWords ? [...userConfig.stopWords] : DEFAULT_CONFIG.stopWords,
      skipSegments: userConfig.skipSegments ? [...userConfig.skipSegments] : DEFAULT_CONFIG.skipSegments,
      featureKeywords: userConfig.featureKeywords ? [...userConfig.featureKeywords] : DEFAULT_CONFIG.featureKeywords,
      synonymMap: { ...DEFAULT_CONFIG.synonymMap, ...userConfig.synonymMap },
      coreBusinessConcepts: userConfig.coreBusinessConcepts ? [...userConfig.coreBusinessConcepts] : DEFAULT_CONFIG.coreBusinessConcepts,
      tweakPatterns: userConfig.tweakPatterns ? [...userConfig.tweakPatterns] : DEFAULT_CONFIG.tweakPatterns,
      ignoredDirs: userConfig.ignoredDirs ? [...userConfig.ignoredDirs] : DEFAULT_CONFIG.ignoredDirs,
      sourceExtensions: userConfig.sourceExtensions ? [...userConfig.sourceExtensions] : DEFAULT_CONFIG.sourceExtensions,
    };
  } catch (error) {
    console.warn('⚠️ Warning: Failed to parse sk-specs.config.json. Using default configurations.', error.message);
    return DEFAULT_CONFIG;
  }
}
