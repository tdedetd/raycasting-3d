import { defaultScene } from './constants/scene-presets/default-scene';
import { Renderer } from './renderer/renderer';
import { Ui } from './renderer/ui';

new Ui(new Renderer(defaultScene, 'canvas-main')).init();
