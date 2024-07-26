import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../components/Header";
import ProjectSidebar from "../components/projectComponents/ProjectSidebar";
import EditProjectOverview from "../components/projectComponents/EditProjectOverview";
import ProjectOverview from "../components/projectComponents/ProjectOverview";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SettingGeneral from "../components/projectComponents/storySetting/SettingGeneral";
import EditSettingGeneral from "../components/projectComponents/storySetting/EditSettingGeneral";
import CreateNewCountryModal from "../components/projectComponents/storySetting/CreateNewCountryModal";
import Country from "../components/projectComponents/storySetting/Country";
import EditCountry from "../components/projectComponents/storySetting/EditCountry";
import CreateNewLandModal from "../components/projectComponents/storySetting/CreateNewLandModal";
import Land from "../components/projectComponents/storySetting/Land";
import EditLand from "../components/projectComponents/storySetting/EditLand";
import CreateBodyOfWaterModal from "../components/projectComponents/storySetting/CreateBodyOfWaterModal";
import BodyOfWater from "../components/projectComponents/storySetting/BodyOfWater";
import EditBodyOfWater from "../components/projectComponents/storySetting/EditBodyOfWater";
import CreateCharacterModal from "../components/projectComponents/characters/CreateCharacterModal";
import EditCharacter from "../components/projectComponents/characters/EditCharacter";
import Character from "../components/projectComponents/characters/Character";
import CreateGroupModal from "../components/projectComponents/characters/CreateGroupModal";
import EditGroup from "../components/projectComponents/characters/EditGroup";
import Group from "../components/projectComponents/characters/Group";
import Theme from "../components/projectComponents/storyThemes/Theme";
import EditTheme from "../components/projectComponents/storyThemes/EditTheme";
import EditPlotOverview from "../components/projectComponents/storyPlot/EditPlotOverview";
import PlotOverview from "../components/projectComponents/storyPlot/PlotOverview";
import EditArc from "../components/projectComponents/storyPlot/EditArc";
import Arc from "../components/projectComponents/storyPlot/Arc";
import CreateArcModal from "../components/projectComponents/storyPlot/CreateArcModal";
import Epilogue from "../components/projectComponents/write/Epilogue";
import EditEpilogue from "../components/projectComponents/write/EditEpilogue";
import Prologue from "../components/projectComponents/write/Prologue";
import EditPrologue from "../components/projectComponents/write/EditPrologue";
import Chapter from '../components/projectComponents/write/Chapter'
import EditChapter from '../components/projectComponents/write/EditChapter'
import CreateChapterModal from "../components/projectComponents/write/CreateChapterModal";

export default function ProjectsPage() {
  const { id } = useParams();
  const [projectInfo, setProjectInfo] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [showCreateCountryModal, setShowCreateCountryModal] = useState(false);
  const [currentCountryId, setCurrentCountryId] = useState(
    window.sessionStorage.getItem("currentCountryId")
  );
  const [showCreateLandModal, setShowCreateLandModal] = useState(false);
  const [currentLandId, setCurrentLandId] = useState(
    window.sessionStorage.getItem("currentLandId")
  );
  const [showBodyOfWaterModal, setShowBodyOfWaterModal] = useState(false);
  const [currentBodyOfWaterId, setCurrentBodyOfWaterId] = useState(
    window.sessionStorage.getItem("currentBodyOfWaterId")
  );
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(
    window.sessionStorage.getItem("currentGroupId")
  );
  const [showCreateCharacterModal, setShowCreateCharacterModal] =
    useState(false);
  const [currentCharacterId, setCurrentCharacterId] = useState(
    window.sessionStorage.getItem("currentCharacterId")
  );
  const [showArcModal, setShowArcModal] = useState(false);
  const [currentArcId, setCurrentArcId] = useState(
    window.sessionStorage.getItem("currentArcId")
  );
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(
    window.sessionStorage.getItem('currentChapterId')
  );
  const countryHandleClose = () => setShowCreateCountryModal(false);
  const countryHandleShow = () => setShowCreateCountryModal(true);
  const landHandleClose = () => setShowCreateLandModal(false);
  const landHandleShow = () => setShowCreateLandModal(true);
  const waterHandleClose = () => setShowBodyOfWaterModal(false);
  const waterHandleShow = () => setShowBodyOfWaterModal(true);
  const characterHandleClose = () => setShowCreateCharacterModal(false);
  const characterHandleOpen = () => setShowCreateCharacterModal(true);
  const groupHandleClose = () => setShowGroupModal(false);
  const groupHandleOpen = () => setShowGroupModal(true);
  const arcHandleClose = () => setShowArcModal(false);
  const arcHandleOpen = () => setShowArcModal(true);
  const chapterHandleClose = () => setShowChapterModal(false)
  const chapterHandleOpen = () => setShowChapterModal(true)
  const [viewNumber, setViewNumber] = useState(
    window.sessionStorage.getItem("viewNumber")
  );
  if (viewNumber === null) {
    setViewNumber('0');
  }
  const viewArray = [
    <EditProjectOverview
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      setIsUpdated={setIsUpdated}
      isUpdated={isUpdated}
    />,
    <ProjectOverview projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <SettingGeneral
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      isUpdated={isUpdated}
    />,
    <EditSettingGeneral
      settingInfo={projectInfo.setting}
      setViewNumber={setViewNumber}
      setIsUpdated={setIsUpdated}
      isUpdated={isUpdated}
      _id={id}
    />,
    <Country projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditCountry
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      currentCountryId={currentCountryId}
      _id={id}
    />,
    <Land projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditLand
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
      currentLandId={currentLandId}
    />,
    <BodyOfWater projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditBodyOfWater
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
      currentBodyOfWaterId={currentBodyOfWaterId}
    />,
    <Character projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditCharacter
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
      currentCharacterId={currentCharacterId}
    />,
    <Group projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditGroup
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
      currentGroupId={currentGroupId}
    />,
    <Theme projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditTheme
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
    />,
    <PlotOverview projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditPlotOverview
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
    />,
    <Arc projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditArc
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
      currentArcId={currentArcId}
    />,
    <Prologue projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditPrologue
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      id={id}
    />,
    <Epilogue projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditEpilogue
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      id={id}
    />,
    <Chapter projectInfo={projectInfo} setViewNumber={setViewNumber} />,
    <EditChapter
      projectInfo={projectInfo}
      setViewNumber={setViewNumber}
      _id={id}
      currentChapterId={currentChapterId}
    />,
  ];

  useEffect(() => {
    window.sessionStorage.setItem("viewNumber", viewNumber);
  }, [viewNumber]);

  useEffect(() => {
    window.sessionStorage.setItem("currentCountryId", currentCountryId);
  }, [currentCountryId]);

  useEffect(() => {
    window.sessionStorage.setItem("currentLandId", currentLandId);
  }, [currentLandId]);

  useEffect(() => {
    window.sessionStorage.setItem("currentCharacterId", currentCharacterId);
  }, [currentCharacterId]);

  useEffect(() => {
    window.sessionStorage.setItem("currentBodyOfWaterId", currentBodyOfWaterId);
  }, [currentBodyOfWaterId]);

  useEffect(() => {
    window.sessionStorage.setItem("currentGroupId", currentGroupId);
  }, [currentGroupId]);

  useEffect(() => {
    window.sessionStorage.setItem("currentArcId", currentArcId);
  }, [currentArcId]);

  useEffect(() => {
    window.sessionStorage.setItem('currentChapterId', currentChapterId)
  }, [currentChapterId])

  useEffect(() => {
    const retrieveProject = async () => {
      const response = await fetch(`http://localhost:5000/project/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const projectInfo = await response.json()
        console.log(projectInfo)
        setProjectInfo(projectInfo)
      }
    if (projectInfo.title) {
      setIsUpdated(true);
      console.log(projectInfo);
    }
  }
  retrieveProject()
  }, [isUpdated]);

  return (
    <Container fluid>
      <Header />
      <Row>
        <CreateArcModal
          showModal={showArcModal}
          setViewNumber={setViewNumber}
          handleClose={arcHandleClose}
          id={projectInfo._id}
          setCurrentArcId={setCurrentArcId}
        />
        <CreateGroupModal
          showModal={showGroupModal}
          setViewNumber={setViewNumber}
          handleClose={groupHandleClose}
          id={projectInfo._id}
          setCurrentGroupId={setCurrentGroupId}
        />
        <CreateCharacterModal
          showModal={showCreateCharacterModal}
          handleClose={characterHandleClose}
          setViewNumber={setViewNumber}
          id={projectInfo._id}
          setCurrentCharacterId={setCurrentCharacterId}
        />
        <CreateBodyOfWaterModal
          showModal={showBodyOfWaterModal}
          handleClose={waterHandleClose}
          setViewNumber={setViewNumber}
          id={projectInfo._id}
          setIsUpdated={setIsUpdated}
          setCurrentBodyOfWaterId={setCurrentBodyOfWaterId}
        />
        <CreateNewCountryModal
          showModal={showCreateCountryModal}
          handleClose={countryHandleClose}
          setViewNumber={setViewNumber}
          id={projectInfo._id}
          setIsUpdated={setIsUpdated}
          setCurrentCountryId={setCurrentCountryId}
        />
        <CreateNewLandModal
          showModal={showCreateLandModal}
          handleClose={landHandleClose}
          setViewNumber={setViewNumber}
          id={projectInfo._id}
          setIsUpdated={setIsUpdated}
          setCurrentLandId={setCurrentLandId}
        />
        <CreateChapterModal
          showModal={showChapterModal}
          handleClose={chapterHandleClose}
          setViewNumber={setViewNumber}
          id={projectInfo._id}
          setCurrentChapterId={setCurrentChapterId}
          setIsUpdated={setIsUpdated}
          write={projectInfo.write}
        />
        <ProjectSidebar
          projectInfo={projectInfo}
          setShowArcModal={setShowArcModal}
          setCurrentArcId={setCurrentArcId}
          setProjectInfo={setProjectInfo}
          setViewNumber={setViewNumber}
          setShowCreateCountryModal={setShowCreateCountryModal}
          setCurrentCountryId={setCurrentCountryId}
          setCurrentLandId={setCurrentLandId}
          setCurrentCharacterId={setCurrentCharacterId}
          setShowCreateLandModal={setShowCreateLandModal}
          setShowBodyOfWaterModal={setShowBodyOfWaterModal}
          setCurrentBodyOfWaterId={setCurrentBodyOfWaterId}
          setCurrentGroupId={setCurrentGroupId}
          setShowGroupModal={setShowGroupModal}
          setShowCreateCharacterModal={setShowCreateCharacterModal}
          setShowChapterModal={setShowChapterModal}
          setCurrentChapterId={setCurrentChapterId}
          isUpdated={isUpdated}
        />
        <>{viewArray[viewNumber]}</>
      </Row>
    </Container>
  );
}
