# MedFlow

MedFlow é uma plataforma inovadora desenvolvida para otimizar o gerenciamento de solicitações de exames e cirurgias médicos. Com uma interface intuitiva e funcionalidades robustas, o MedFlow facilita a administração, visualização e comunicação de status dos exames para todos os envolvidos no processo.

## Funcionalidades da MedFlow:

### Tipos de Usuários e Autenticação:

- **Clínica (Funcionários):** Acesso somente para visualização. Podem ver o status dos exames e detalhes das solicitações, mas não podem editar ou alterar informações.

- **Administradores:** Acesso total para gerenciar usuários, cadastrar e editar solicitações de exames, configurar notificações e visualizar relatórios e dashboards.

- **Solicitantes:** Podem registrar e gerenciar solicitações de exames para convênios, atualizar o status dos exames, e assegurar conformidade com as políticas dos convênios.

## Registro e Gerenciamento de Solicitações de Exames:

- Administradores e responsáveis pelos convênios podem registrar novas solicitações de exames, especificar o tipo de exame e associá-las a pacientes e convênios específicos.

- Exames podem ser filtrados por convênio, tipo de exame, ou data de solicitação.

### Gestão de Status de Exames:

- **Análise:** Indica que a solicitação está sendo revisada para aprovação.
- **Negado:** Ao selecionar este status, uma caixa de texto obrigatória se abre para que o usuário insira o motivo da negação. Após confirmar a negação, uma notificação é enviada ao paciente.
- **Autorizado:** Quando esse status é selecionado, uma confirmação é solicitada para garantir que o usuário realmente deseja autorizar o exame. Após a confirmação, uma notificação é enviada ao paciente.
- **Pendente:** Ao marcar um exame como pendente, uma caixa de texto é aberta para que o usuário insira os detalhes da pendência ou solicite documentos adicionais. Esse status não dispara notificações automaticamente, mas os motivos podem ser visualizados pelos funcionários da clínica e administradores.

## Notificações Automáticas:

- Notificações por SMS e e-mail são enviadas automaticamente para os status "Autorizado" e "Negado", informando o paciente sobre o status atualizado do exame.

- As notificações incluem informações essenciais, como detalhes de contato para esclarecimentos adicionais ou instruções sobre os próximos passos.

## Visualização para Funcionários da Clínica:

- Funcionários da clínica podem visualizar listas de exames e verificar o status e detalhes associados (ex.: tipo de exame, paciente, status, motivo da negação ou pendência).

- A interface é simplificada para facilitar o acesso rápido às informações necessárias.


## Dashboard para Administradores:

- Um painel de controle interativo que permite aos administradores monitorar:

  - **Número de Solicitações de Exames:** Exibir o total de solicitações recebidas, categorizadas por status (Análise, Negado, Autorizado, Pendente).
  - **Tempo Médio de Processamento:** Informações sobre o tempo médio de análise e autorização dos exames.
  - **Solicitações por Convênio:** Gráficos ou tabelas mostrando a distribuição das solicitações por convênio específico.
  - **Exames mais Solicitados:** Estatísticas sobre os tipos de exames mais frequentes.
  - **Alertas e Notificações:** Área para visualizar notificações de status críticos, como um grande número de exames pendentes ou negados.


## Gerenciamento de Relatórios:

- Ferramentas para gerar relatórios detalhados sobre solicitações, tempo de processamento, motivos de negação e outros indicadores-chave de desempenho.
- Opção de exportar relatórios para formatos como PDF ou Excel para análises externas.


# Tecnologias Recomendadas

- **Front-end:**  React e Tailwind Css.
- **Back-end:** Java com Spring Boot.
- **Banco de Dados:** PostgreSQL.
- **Notificações:** Integração com serviços de envio de SMS e e-mail(Java Mail).
- **Graficos:** Apex Chart

# Dependencias - Spring Boot:

- Spring Web (para criar APIs REST)
- Spring Data JPA (para integração com o banco de dados)
- Spring Security (para autenticação)
- Spring Boot DevTools (para facilitar o desenvolvimento)
- PostgreSQL Driver (para conexão com o banco de dados PostgreSQL)
- Thymeleaf (páginas HTML renderizadas no back-end)
- Java Mail Sender (para envio de e-mails)