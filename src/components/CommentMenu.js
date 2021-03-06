import React from 'react'
import { ctx } from '@/biz/context'
import { CommentEdit } from '../components'
import {
  deleteComment,
  removeComment,
  updatePost,
  restoreComment,
} from '@/redux/action'
import { connect } from 'react-redux'
import './CommentMenu.scss'

class CommentMenu extends React.Component {
  constructor(props) {
    //ctx.logger.verbose("CommentMenu 생성자 호출");
    super(props)
    this.showMenu = this.showMenu.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.showEdit = this.showEdit.bind(this)
    this.hideEdit = this.hideEdit.bind(this)
    this.editComment = this.editComment.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
    this.removeComment = this.removeComment.bind(this)
    this.restoreComment = this.restoreComment.bind(this)

    this.state = {
      clicked: false,
      editClicekd: false,
    }
  }

  deleteComment() {
    ctx.confirm({
      message: 'Delete this?',
      width: 'inherit',
      onYes: async () => {
        try {
          await ctx.api.deleteComment({
            key: this.props.comment.key,
            uuid: ctx.user.uuid,
          })
          this.hideMenu()

          this.props.deleteComment(this.props.comment.key)
        } catch (e) {
          ctx.alert({
            message: e.message,
            style: 'danger',
            width: '175px',
          })
        }
      },
      onNo: () => {
        this.hideMenu()
      },
    })
  }

  removeComment() {
    ctx.confirm({
      message: 'Remove this?',
      onYes: async () => {
        try {
          await ctx.api.removeComment({
            key: this.props.comment.key,
            uuid: ctx.user.uuid,
          })
          this.props.removeComment(this.props.comment.key)

          // 부모 글의 commentCnt 1감소
          const postKey = this.props.comment.postKey
          let post = this.props.posts.find((p) => p.key === postKey)
          post.commentCnt = post.commentCnt ? post.commentCnt - 1 : 1
          this.props.updatePost(post)
        } catch (e) {
          ctx.alert({
            message: e.message,
            style: 'danger',
          })
        }
      },
      onNo: () => {
        this.hideMenu()
      },
    })
  }

  restoreComment() {
    //if(!confirm("Restore this?")) return;
    ctx.confirm({
      message: 'Restore this?',
      onYes: () => {
        ctx.api
          .restoreComment({
            key: this.props.comment.key,
            uuid: ctx.user.uuid,
          })
          .then((res) => {
            this.props.restoreComment(this.props.comment.key)
            this.hideMenu()
          })
          .catch((e) => {
            ctx.alert({ message: e.message, style: 'danger' })
            this.hideMenu()
          })
      },
    })
  }

  editComment() {
    ctx.api
      .authComment({
        key: this.props.comment.key,
        uuid: ctx.user.uuid,
      })
      .then((res) => {
        if (res.status === 'Success') {
          this.showEdit()
          //ctx.temp = res.comment;
          //this.props.history.push("/edit/"+this.props.comment.key);
        } else {
          ctx.alert({
            message: res.message,
            style: 'danger',
          })
        }
      })
  }

  hideMenu() {
    this.setState({ clicked: false })
  }

  showMenu() {
    this.setState({ clicked: true })
  }

  hideEdit() {
    this.setState({ editClicked: false, writer: '', content: '' })
  }

  showEdit() {
    this.setState({ editClicked: true })
  }

  render() {
    //ctx.logger.verbose("CommentMenu 렌더링");
    return (
      <div className="commentMenu">
        {this.state.clicked ? (
          <div className="navi">
            {this.props.comment.deleted ? (
              <div className="icon-ccw" onClick={this.restoreComment}>
                Restore
              </div>
            ) : (
              <React.Fragment>
                <div className="icon-pencil" onClick={this.editComment}>
                  Edit
                </div>
                <div className="icon-trash-empty" onClick={this.deleteComment}>
                  Delete
                </div>
              </React.Fragment>
            )}
            <div className="icon-trash" onClick={this.removeComment}>
              Remove
            </div>
            <div className="icon-cancel" onClick={this.hideMenu}>
              Cancel
            </div>
          </div>
        ) : (
          <div className="navi" onClick={this.showMenu}>
            ...
          </div>
        )}

        {this.state.editClicked && (
          <CommentEdit
            hideEdit={this.hideEdit}
            hideMenu={this.hideMenu}
            comment={this.props.comment}
          />
        )}
      </div>
    )
  }
}

export default connect((state) => ({ posts: state.data.posts }), {
  deleteComment,
  removeComment,
  updatePost,
  restoreComment,
})(CommentMenu)
