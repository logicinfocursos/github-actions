Eu quero aprender a usar o github actions para implementar o pipeline de desenvolvimento do projeto para empresa que eu trabalho como techlead, a Always On, projeto Maestro A.I. Mas para aprender, vou usar o meu github pessoal e containers docker (local). Eu uso windows 11.

Esse projeto de teste é basicamente um formulário simples em next js (depois irei usar o mesmo projeto para automatizar testes). 

Para esse momento de aprendizado, vou simular as branches existentes na Always On:
- workitem-issue (branches criadas para implementar um workitem, por exemplo usamos o app.plane.so como ferramenta de gerenciamento de projetos, os workitens são nomeados assim, exemplo: "MAEST-365")
- homolog - onde ocorrem os testes manuais e automatizados
- production - é a branch que detém o código em produção que normalmente está em execução em uma vps (para efeitos desse aprendizado iremos usar apenas um docker no meu pc)
- main - código seguro

Para atualizar a branch production deve ocorrer um pull request e após a autorização, atualizar a branch production com o conteúdo de determinada branch workitem-issue. Quando a branch homolog for atualizada, o container do projeto tmabém precisa ser atualizado.

Para atualizar a main deve ocorrer um novo pull request (trataremos isso posteriormente).

Posteriormente deveremos também implmentar outros processos (mas vamos por etapas, quero entender aos poucos o processo todo)
- realizar testes automatizados
- rotina de rollback
- atualizar a branch main

Como base nesse cenário você pode elaborar um passo-a-passo?