console.log("App.js start");

import React from 'react';
import { List, Write, Post, Edit, PostHistory } from "./pages";
import { Route, Switch } from 'react-router-dom';
import moment from "moment";
import shortcut from "./ext/shortcut";
import {tp} from "./tp.js";
import {createStore} from 'redux';
import {reducer} from "./redux/reducer";



export default class App extends React.Component {

  constructor(props) {
    console.log("App 생성자 호출..");
    super(props);


    const go = (page) => () =>{
      let context = location.pathname.split("/")[1];
      context = ["", "list", "post", "edit", "postHistory", "write"].includes(context) ? "" : "/" + context;
      return this.props.history.push(context + "/" + page);
    }
    const sa = (keys, func) => keys.split(",").forEach(key => shortcut.add(key, func));
    sa("Alt+W", go("write"));
    sa("Alt+L", go("List"));
    
    

    // 초기상태 정의
    this.state = {
      view: {
        post:{}     //  글보기 화면 직접 접근했을 때 데이터는 이 곳에 넣어야지.. 그럼 더 좋을까?? 음음...
      },
      data: {
        posts: [],        // 전체 글
        comments: []     // 전체 댓글
      }
    };
    tp.view.App = this;

    // 스토어 최초 한번 생성
    tp.store = createStore(reducer, this.state);

    // 이후 App 가 스토어 상태를 구독하도록 설정
    this.unsubscribe = tp.store.subscribe(() => {
        this.setState(tp.store.getState());
    });
    //moment.locale('ko');
    moment.locale('en');
  }

  shouldComponentUpdate(prevProps, prevState) {
    const render = prevProps.location.pathname !== this.props.location.pathname || prevState !== this.state;
    // 여기는 setState 나 props 가 바뀔 때만 호출됨, 객체 생성자 호출될 때에는 호출되지 않는다(무조건 최초 한번은 렌더링 수행)
    //console.log("App.shouldComponentUpdate returns [" + render + "]");
    return render;
  }

  componentWillUnmount(){
    console.log("# App unsubscribe store..");
    this.unsubscribe();
  }



  render() {
    console.log("App 렌더링..");

    const renderList = ({history, match}) => {
      tp.thispage = "List";
      return <List history={history} posts={this.state.data.posts.filter(p => p.origin === undefined)} context={match.params.context}/> ;
    }
    const renderPost = ({history, match}) => {
      tp.thispage = "Post";
      return <Post history={history} postKey={match.params.key} post={this.state.data.posts.find(post => post.key === match.params.key)} context={match.params.context}/> ;
    }
    const renderEdit = ({history, match}) => {
      tp.thispage = "Edit";
      return <Edit history={history} postKey={match.params.key} post={this.state.data.posts.find(post => post.key === match.params.key)} context={match.params.context}/> ;
    }
    const renderWrite = ({history, match}) => {
      tp.thispage = "Write";
      return <Write history={history} context={match.params.context} /> ;
    }
    const renderPostHistory = ({history, match}) => {
      tp.thispage = "PostHistory";
      return <PostHistory history={history} postKey={match.params.key} phist={this.state.data.posts.filter(p=> p.origin === match.params.key)} context={match.params.context}/> ;
    }

    return (
      <div>
        <Switch>{/*Switch는 매칭되는 첫번재꺼만 보여주고 아래꺼는 버림*/}
        {/* public */}
          <Route path="/post/:key" render={renderPost} />
          <Route path="/postHistory/:key" render={renderPostHistory} />
          <Route path="/edit/:key" render={renderEdit} />
          <Route path="/write" render={renderWrite} />
          <Route path="/list" render={renderList} />

        {/* context */}
          <Route path="/:context/post/:key" render={renderPost} />
          <Route path="/:context/postHistory/:key" render={renderPostHistory} />
          <Route path="/:context/edit/:key" render={renderEdit} />
          <Route path="/:context/write" render={renderWrite} />
          <Route path="/:context/list" render={renderList} />
          <Route path="/:context" render={renderList} />

          <Route path="/" render={renderList} />
        </Switch>
      </div>
    );
  }
}
