import React, { useRef, useState } from 'react';
import './Post.css';
import { Row, Col, Avatar, Typography, Icon, Space, message, Divider, Dropdown, Skeleton } from 'antd';
import TimeAgo from 'javascript-time-ago'
import { Link } from 'react-router-dom';
import en from 'javascript-time-ago/locale/en'
import { FaBookmark, FaRegBookmark, FaRegStar, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import 'antd/dist/antd.css';
import { InView, useInView } from 'react-intersection-observer';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import "video-react/dist/video-react.css";
import { Player, BigPlayButton, ControlBar, LoadingSpinner, VolumeMenuButton, Shortcut } from 'video-react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import SRtext from '../Utilities/SRtext';
import { MdExpandMore } from "react-icons/md";
import Loader from 'react-loader-spinner'
import { IoMdMore } from "react-icons/io";
import Drawer from 'react-drag-drawer';
import Option from './Options';
import ReplyList from './ReplyList';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');
const { Text, Title } = Typography;
const serverUrl = "http://localhost:3001/";


class Reaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            youreply: null,
            delid:null,
            replycount: this.props.obj.replycount,
            reaction: this.props.obj,
            replies: [],
            showreply: false,
            replyalltext: "Show all replies",
            repliesLoading: false,
            finish: false,
            loadingmore: false,
            replyopen: false,
            closereply: true,
            //like
            likeState: FaRegStar,
            likeColor: "",
            caption: "",
            loading: false,
            avatar: localStorage.getItem("ava") === undefined ? "http://localhost:3001/AF.png" : localStorage.getItem("ava")
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        axios.get(`${serverUrl}data/getUserProfileInit?userid=${this.props.obj.userid}`).then((response) => {
            let temp = this.state.reaction;
            if (response.data) {
                temp.username = response.data.username;
                temp.avatar = response.data.avatar;
                temp.verify = response.data.verify;
                this.setState({ reaction: temp, loading: false })
                //getting state
                if (this.props.type === 0) {
                    axios.get(`${serverUrl}feedstat/getReplystate?userid=${localStorage.getItem('$#@!')}&replyid=${this.props.obj._id}`)
                        .then((res) => {
                            if (res.data) {
                                this.setState({
                                    likeState: FaStar,
                                    likeColor: "myblue",
                                    loading: false
                                })
                            }
                        })
                }
                else {
                    axios.get(`${serverUrl}feedstat/getReactionstate?userid=${localStorage.getItem('$#@!')}&reactionid=${this.props.obj._id}`)
                        .then((res) => {
                            if (res.data) {
                                this.setState({
                                    likeState: FaStar,
                                    likeColor: "myblue",
                                    loading: false
                                })
                            }
                        })
                }

            }
            else {
                temp.type = 0;
                this.setState({ reaction: temp, loading: false });
            }
        })
    }

    like = () => {
        if (this.state.likeColor === "") {
            let temp = this.state.reaction;
            temp.likes++;
            this.setState({
                likeState: FaStar,
                likeColor: "myblue",
                reaction: temp
            })
            setTimeout(() => this.finallike(), 3000);
        }
        else {
            let temp = this.state.reaction;
            temp.likes--;
            this.setState({
                likeState: FaRegStar,
                likeColor: "",
                reaction: temp

            })
            setTimeout(() => this.finaldislike(), 3000);
        }

    }

    finaldislike = () => {
        if (this.state.likeColor === "") {
            if (this.props.type === 0) {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/dislikeReply',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        replyid: this.props.obj._id
                    }
                })
            }
            else {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/dislikeReaction',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        reactionid: this.props.obj._id
                    }
                })
            }

        }
    }
    finallike = () => {
        if (this.state.likeColor === "myblue") {
            if (this.props.type === 0) {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/likeReply',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        replyid: this.props.obj._id
                    }
                })
            }
            else {
                axios({
                    method: 'put',
                    url: serverUrl + 'feedstat/likeReaction',
                    data: {
                        userid: localStorage.getItem('$#@!'),
                        reactionid: this.props.obj._id
                    }
                })
            }

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.obj !== this.props.obj) {

            this.setState({ loading: true })
            axios.get(`${serverUrl}data/getUserProfileInit?userid=${this.props.obj.userid}`).then((response) => {
                let temp = this.state.reaction;
                if (response.data) {
                    temp.username = response.data.username;
                    temp.avatar = response.data.avatar;
                    temp.verify = response.data.verify;
                    this.setState({ reaction: temp, loading: false })
                    //getting state
                    if (this.props.type === 0) {
                        axios.get(`${serverUrl}feedstat/getReplystate?userid=${localStorage.getItem('$#@!')}&replyid=${this.props.obj._id}`)
                            .then((res) => {
                                if (res.data) {
                                    this.setState({
                                        likeState: FaStar,
                                        likeColor: "myblue",
                                        loading: false
                                    })
                                }
                            })
                    }
                    else {
                        axios.get(`${serverUrl}feedstat/getReactionstate?userid=${localStorage.getItem('$#@!')}&reactionid=${this.props.obj._id}`)
                            .then((res) => {
                                if (res.data) {
                                    this.setState({
                                        likeState: FaStar,
                                        likeColor: "myblue",
                                        loading: false
                                    })
                                }
                            })
                    }

                }
                else {
                    temp.type = 0;
                    this.setState({ reaction: temp, loading: false });
                }
            })
        }
    }

    tagColor = (text) => {
        let temp = text.split(" ");
        var result = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i][0] !== undefined && temp[i][0].trim() === '@' && temp[i].trim().length !== 1) {
                var a = temp[i];
                result.push(" ");
                result.push(<Link to={'/profile/' + a.slice(1)}><span className="myblue pointer" >{a}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '#' && temp[i].trim().length !== 1) {
                var a1 = temp[i];
                result.push(" ");
                result.push(<Link to={'/tag/' + a1.slice(1)}><span className="myblue pointer">{a1}</span></Link>);
            }
            else if (temp[i][0] !== undefined && temp[i][0].trim() === '&' && temp[i].trim().length !== 1) {
                var a2 = temp[i];
                result.push(" ");
                result.push(<Link to={'/group/' + a2.slice(1)}><span className="myblue pointer">{a2}</span></Link>);
            }
            else {
                result.push(" ");
                result.push(<span style={{ color: 'black' }}>{temp[i]}</span>);
            }
        }
        return result;
    }
    getCaption = (caption) => {
        this.setState({ caption: caption })
    }

    reply = () => {
        if (this.state.caption.trim() === "") {
            message.warning("Please write a reply!!", 3);
            return;
        }
        axios.post(`${serverUrl}feedstat/uploadReply`, {
            userid: localStorage.getItem('$#@!'),
            reactionid: this.props.obj._id,
            text: this.state.caption,
            date: new Date()
        })
            .then((res) => {
                if (res.data.stat) {
                    let temp = this.state.replies;
                    temp.unshift(res.data.obj);
                    let obj = this.state.reaction;
                    obj.replycount++;
                    this.setState({ replies: temp, youreply: res.data.obj,replycount:this.state.replycount++, reaction: obj, replyload: false, replyopen: false })
                }
            })
            .catch((error) => {
                this.setState({ replyload: false, replyopen: false })
                message.warning('Something went Wrong! Try again later', 3);
            });

    }

    showreplies = () => {
        if (this.state.replies.length !== 0) {
            this.setState({ closereply: false, repliesLoading: false, showreplies: false });
            return;
        }
        this.setState({ repliesLoading: true })
        axios.get(`${serverUrl}feeds/getInitReplies?reactionid=${this.props.obj._id}`).then((response) => {
            if (response.data.length === this.state.reaction.replycount) {
                this.setState({ finish: true })
            }
            this.setState({ replies: response.data, closereply: false, repliesLoading: false, showreplies: false })
        }).catch(e => {
            this.setState({ repliesLoading: false, showreplies: false })
            message.warning("Unable fetch Replies!! Server Down.", 3)
        })
    }

    updateReaction=(count,list)=>{
        this.setState({ reaction:count,replies:list })
    }

    render() {

            const obj = this.state.reaction;
            return (
            <Skeleton loading={this.state.loading} active avatar className="p-3  mr-5">
                    <div className="mb-3 text-left  ">
                        <Row justify="space-around" className="p-1" align="middle">
                            <Col span={12} className="text-left p-2">
                                <Row type="flex" align="middle">
                                    <Col flex="auto" >
                                        <Avatar className="d-inline-block" src={obj.avatar} size={"large"} />
                                    </Col>
                                    <Col flex="auto" className="pl-1">
                                        <Row type="flex" align="middle">
                                            <Col flex="auto">
                                                <Text strong className="username myblue ">{obj.username}</Text>
                                            </Col>

                                        </Row>

                                        <Row type="flex" style={{ marginTop: "-5px" }}>
                                            <Col flex="auto">
                                                <Text type="secondary" className="time">{timeAgo.format(Date.now() - (new Date().getTime() - new Date(obj.time).getTime()))}</Text>
                                            </Col>

                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12} className="text-right pt-2" >
                                <Row type="flex" align="middle" className="float-right text-right" style={{ marginBottom: "-5px" }}>
                                    <Col flex="auto">
                                        <Text strong className="pointer pr-1">{obj.likes} </Text>
                                    </Col>
                                    <Col flex="auto" >
                                        <div style={{
                                            fontWeight: "500",
                                            fontSize: "160%",
                                            marginTop: "2px"
                                        }} className="myblue float-right pointer pr-1 ">
                                            <this.state.likeState onClick={this.like} className={this.state.likeColor + " grow "} />
                                        </div>
                                    </Col>
                                    {this.props.first !== true ? <Col flex="auto">
                                        <IoMdMore onClick={() => this.props.openoptions(obj._id)} className=" pointer float-right" style={{ fontSize: "160%", }} />
                                    </Col> : null}
                                </Row>
                            </Col>
                        </Row>
                        <Row    >
                            <Col xs={24} className="reacttext">
                                <div>
                                    <Text strong className="text-black" style={{whiteSpace:"pre-line"}} >
                                        {this.tagColor(obj.text)}
                                    </Text>
                                </div>
                                {obj.type === 2 ?
                                    <div className="reactimagecenter">
                                        <img src={obj.medialink} className="img-fluid reactimage mr-3" />
                                    </div> :
                                    obj.type === 3 ?
                                        <div className="reactionvideo">
                                            <Player
                                                playsInline
                                                className="reactionvideo"
                                                poster="/assets/poster.png"
                                                src={obj.medialink}
                                            >
                                                <Shortcut clickable={true} />
                                                <LoadingSpinner />
                                                <VolumeMenuButton disabled />

                                                <ControlBar autoHide={true} autoHideTime={true}>
                                                </ControlBar>
                                                <BigPlayButton position="center" />
                                            </Player>
                                        </div> :
                                        obj.type === 4 ?
                                            <div className="pt-1 pb-1 audioreaction">
                                                <audio controls className="w-100 " src={obj.medialink} controlsList="nodownload" />
                                            </div> : null}
                            </Col>
                        </Row>
                        {this.props.type !== 0 ?
                            <ReplyList obj={this.props.obj} first={this.props.first} updateReaction={this.updateReaction}
                            /> : null}

                    </div>

            </Skeleton>
            )
        
    }
}


export default Reaction; 
