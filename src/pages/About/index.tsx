import React from 'react';
import { Code2, Database, ExternalLink, GraduationCap, Info } from 'lucide-react';
import './style.css';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <span className="about-kicker">Sobre o projeto</span>
        <h2>Pokédex</h2>
        <p>
          Uma aplicação criada como projeto de faculdade para consultar, comparar, favoritar
          e organizar Pokémon em times.
        </p>
      </header>

      <div className="about-content">
        <section className="about-section">
          <div className="about-icon">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3>Objetivo</h3>
            <p>
              O projeto nasceu com foco em mobile, mas evoluiu para uma experiência mais completa
              em telas de computador, mantendo suporte para smartphones.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-icon">
            <Database size={24} />
          </div>
          <div>
            <h3>Fonte dos dados</h3>
            <p>
              As informações dos Pokémon, tipos, estatísticas, sprites e evoluções são obtidas
              pela PokéAPI.
            </p>
            <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
              Acessar PokéAPI
            </a>
          </div>
        </section>

        <section className="about-section">
          <div className="about-icon">
            <Code2 size={24} />
          </div>
          <div>
            <h3>Tecnologias</h3>
            <p>
              Interface construída com React, TypeScript e Vite, usando componentes reutilizáveis
              e consumo de dados externos por API.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-icon">
            <ExternalLink size={24} />
          </div>
          <div>
            <h3>Desenvolvedor</h3>
            <p>Projeto desenvolvido por Vitallzin.</p>
            <a href="https://github.com/Vitallzin" target="_blank" rel="noreferrer">
              github.com/Vitallzin
            </a>
          </div>
        </section>

        <section className="about-note">
          <Info size={18} />
          <p>
            Este site é um projeto acadêmico e não possui vínculo oficial com Nintendo,
            Game Freak, The Pokémon Company ou PokéAPI.
          </p>
        </section>
      </div>
    </div>
  );
};
