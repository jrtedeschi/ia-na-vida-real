"""Comparativo (ticket 09): a mesma animação de token em Manim Community 0.21.

Não é o pipeline recomendado; existe só para medir esforço, peso e fidelidade.
Render (da pasta animations/):
    .venv/bin/manim -qh --format webm _comparativo-manim/token_split.py TokenSplit
    .venv/bin/manim -qh _comparativo-manim/token_split.py TokenSplit        # mp4
"""

from pathlib import Path

import numpy as np
from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UL,
    UP,
    Create,
    CurvedArrow,
    DashedVMobject,
    FadeIn,
    FadeOut,
    LaggedStart,
    Rectangle,
    Scene,
    Text,
    VGroup,
    VMobject,
    Write,
    config,
    register_font,
)

CONCRETE = "#EDEEEA"
PAPER = "#F8F8F5"
INK = "#121311"
ORANGE = "#FF5A1F"
ORANGE_INK = "#C23A08"
GRAPHITE = "#5B5F57"

TOKENS = ["Organ", "ize", " minha", " sem", "ana", " com", " 3", " prior", "idades"]
CIRCLED = (0, 1)
FONTS = Path(__file__).parent / "fonts"

config.background_color = PAPER


def rough_ellipse(target, pad=0.22, overshoot=0.55, seed=11):
    """Elipse 'à mão' em volta de um mobject (mesma ideia do ink.js)."""
    rng = np.random.default_rng(seed)
    cx, cy, _ = target.get_center()
    rx = target.width / 2 + pad
    ry = target.height / 2 + pad * 0.8
    w1, w2 = rng.uniform(0, 2 * np.pi, 2)
    start = -2.2 + 3.3  # topo à esquerda (eixo y para cima no Manim)
    pts = []
    for t in np.linspace(0, 1, 40):
        a = start + t * (2 * np.pi + overshoot)
        grow = 1 + 0.12 * t
        noise = 1 + 0.035 * np.sin(3 * a + w1) + 0.02 * np.sin(5 * a + w2)
        pts.append([cx + np.cos(a) * rx * grow * noise, cy + np.sin(a) * ry * grow * noise, 0])
    path = VMobject(stroke_color=ORANGE, stroke_width=7)
    path.set_points_smoothly(pts)
    return path


class TokenSplit(Scene):
    def construct(self):
        with register_font(str(FONTS / "SchibstedGrotesk.ttf")), register_font(str(FONTS / "Kalam-Bold.ttf")):
            self.build_scene()

    def build_scene(self):
        label_before = Text("você escreve:", font="Kalam", weight="BOLD", color=GRAPHITE, font_size=30)
        label_before.to_corner(UL).rotate(0.035)
        sentence = Text("".join(TOKENS), font="Schibsted Grotesk", weight="BOLD", color=INK, font_size=44)

        self.play(FadeIn(sentence, shift=UP * 0.15), FadeIn(label_before), run_time=0.6)
        self.wait(0.8)

        # Tokens separados: cada pedaço vira um Text próprio com caixa tracejada.
        pieces = VGroup(*[Text(t.strip(), font="Schibsted Grotesk", weight="BOLD", color=INK, font_size=44) for t in TOKENS])
        pieces.arrange(RIGHT, buff=0.32, aligned_edge=DOWN)
        if pieces.width > config.frame_width - 1:  # sem reflow: o layout é por conta de quem anima
            pieces.scale_to_fit_width(config.frame_width - 1)
        boxes = VGroup(
            *[
                DashedVMobject(
                    Rectangle(width=p.width + 0.22, height=0.82, stroke_color=GRAPHITE, stroke_width=2).move_to(p.get_center()),
                    num_dashes=24,
                )
                for p in pieces
            ]
        )
        label_after = Text("a IA lê assim:", font="Kalam", weight="BOLD", color=GRAPHITE, font_size=30)
        label_after.move_to(label_before, aligned_edge=LEFT).rotate(0.035)

        # Mapear letras da frase -> letras dos pedaços (sem espaços) para o "split".
        src = [g for g in sentence]
        dst = [g for p in pieces for g in p]
        self.play(
            *[src[i].animate.move_to(dst[i]) for i in range(min(len(src), len(dst)))],
            FadeOut(label_before),
            FadeIn(label_after),
            run_time=1.0,
        )
        self.add(pieces)
        self.remove(sentence)
        self.play(LaggedStart(*[Create(b) for b in boxes], lag_ratio=0.12), run_time=1.6)

        circled = VGroup(*[boxes[i] for i in CIRCLED])
        ring = rough_ellipse(circled)
        self.play(Create(ring), run_time=1.1)
        note = Text("1 palavra, 2 tokens", font="Kalam", weight="BOLD", color=ORANGE_INK, font_size=28)
        note.next_to(ring, DOWN, buff=0.35).shift(RIGHT * 0.9).rotate(0.05)
        arrow = CurvedArrow(note.get_left() + LEFT * 0.08, ring.get_bottom() + UP * 0.05, color=ORANGE_INK, stroke_width=3, tip_length=0.15)
        self.play(Create(arrow), FadeIn(note, shift=UP * 0.1), run_time=0.6)
        self.wait(0.6)

        tally = Text("6 palavras  →  9 tokens", font="Schibsted Grotesk", weight="HEAVY", color=INK, font_size=52)
        tally.to_edge(DOWN, buff=0.9)
        self.play(Write(tally), run_time=1.0)
        self.wait(1.4)
