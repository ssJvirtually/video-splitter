import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';

const ffmpeg = new FFmpeg();

export async function loadFFmpeg(setStatus) {
  if (ffmpeg.loaded) return;

  ffmpeg.on('log', ({ message }) => {
    console.log(message);
  });

  setStatus('Loading FFmpeg (~20MB)...');
  await ffmpeg.load({ coreURL, wasmURL });
  setStatus('FFmpeg Ready');
}

export async function splitVideo(file, setProgress, setStatus) {
  let progressHandler;

  try {
    await loadFFmpeg(setStatus);

    progressHandler = ({ progress }) => {
      setProgress(Number((progress * 100).toFixed(2)));
    };
    ffmpeg.on('progress', progressHandler);

    setStatus('Processing video...');

    const existingFiles = await ffmpeg.listDir('/');
    for (const f of existingFiles) {
      if (f.name.startsWith('chunk_') || f.name === 'input.mp4') {
        try {
          await ffmpeg.deleteFile(f.name);
        } catch {
          // Ignore cleanup failures; they should not block the new split.
        }
      }
    }

    await ffmpeg.writeFile('input.mp4', await fetchFile(file));

    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-c', 'copy',
      '-map', '0',
      '-segment_time', '30',
      '-f', 'segment',
      'chunk_%03d.mp4'
    ]);

    const files = await ffmpeg.listDir('/');
    const chunkFiles = files.filter((entry) => !entry.isDir && entry.name.startsWith('chunk_'));

    const chunks = [];
    for (const chunk of chunkFiles) {
      const data = await ffmpeg.readFile(chunk.name);
      chunks.push({ name: chunk.name, data });
    }

    setStatus('Done');
    return chunks;
  } catch (error) {
    console.error(error);
    setStatus(`Error: ${error?.message || 'Failed to split video'}`);
    throw error;
  } finally {
    if (progressHandler) {
      ffmpeg.off('progress', progressHandler);
    }
  }
}
