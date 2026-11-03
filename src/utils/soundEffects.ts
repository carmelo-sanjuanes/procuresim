// Motor de Efectos de Sonido Sintetizados (Web Audio API) - ProcureSim v2.0
// Genera sonidos armónicos limpios y sutiles sin requerir archivos de audio externos.

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Leer preferencia guardada del usuario
    const saved = localStorage.getItem('procuresim_sound_enabled');
    this.muted = saved === 'false';
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('procuresim_sound_enabled', String(!this.muted));
    if (!this.muted) {
      this.playSoftPop();
    }
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('procuresim_sound_enabled', String(!this.muted));
  }

  /**
   * Clic táctil suave (transición rápida tipo interruptor de diseño)
   */
  public playClick() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignorar en navegadores restringidos
    }
  }

  /**
   * Pop sutil al abrir o desplegar un panel
   */
  public playSoftPop() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Silencio
    }
  }

  /**
   * Sonido de transición de etapa (ascendente armónico)
   */
  public playStepChange() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // Acorde C - E - G

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);

        gain.gain.setValueAtTime(0.035, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.22);
      });
    } catch {
      // Silencio
    }
  }

  /**
   * Acorde de éxito mayor (completitud de hito o desempate ganado)
   */
  public playSuccess() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.05, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch {
      // Silencio
    }
  }

  /**
   * Fanfarria festiva para cierre o adjudicación definitiva
   */
  public playFanfare() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Secuencia triunfal: Sol -> Do -> Mi -> Sol (arriba)
      const sequence = [
        { f: 392.0, t: 0.0, d: 0.15 },
        { f: 523.25, t: 0.12, d: 0.15 },
        { f: 659.25, t: 0.24, d: 0.18 },
        { f: 783.99, t: 0.38, d: 0.55 },
        { f: 1046.5, t: 0.42, d: 0.6 }
      ];

      sequence.forEach(({ f, t, d }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.06, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {
      // Silencio
    }
  }
}

export const soundEffects = new SoundEffectsEngine();
