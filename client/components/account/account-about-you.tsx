import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Text from '../control/text';
import React, { useEffect, useState } from 'react';
import { Color, FontSize, Radius, Style } from '../../style';
import _Button from '../control/button';
import _Image from '../control/image';
import _Cluster from '../control/cluster';
import _ClusterOption from '../control/cluster-option';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AccountScreenType, authTokenHeader, env, getLocalStorage, navProp, NavTo, setLocalStorage } from '../../helper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const AccountAbout = (props: any) => {
    const navigation = useNavigation<navProp>();
    const [error,setError] = useState('');
    const [bioForm,setBioForm] = useState('');
    const [tagForm,setTagForm] = useState([]);
    const [init,setInit] = useState(false);
    const [isSaved,setIsSaved] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isLoaded,setIsLoaded] = useState(false);
    const [isComplete,setIsComplete] = useState(false);
    const [tagsAmount,setTagsAmount] = useState(0);
    const tags = [
        "✈️ Travel",
        "📷 Photography",
        "💪 Fitness",
        "🍲 Food",
        "📖 Reading",
        "🎵 Music",
        "🎨 Arts",
        "💻 Technology",
        "⚽ Sports",
        "🐾 Pets",
        "🚗 Cars",
        "💼 Business",
        "🎥 Film",
        "🎮 Gaming",
        "🔬 Science",
        "🏛 History",
        "🌸 Anime",
        "🛍 Shopping",
        "🍻 Alcohol",
      ];

    useEffect(() => {
        if (!init) {
            onLoad();
            setInit(true);
        }
        if (props.isSetup && isComplete) {
            setIsSaved(true);
            setIsComplete(false);
        }
    }, [props.isSetup, bioForm, tagForm, isLoaded, isComplete])

    const setupPage = (data: any) => {
        setBio(data.bio);
        if (data.tags) {
            let tags = [] as never[];
            data.tags.forEach((x: any) => {
                tags.push(x.tag as never);
            });
            setTagForm(tags);
        }
        if (props.isSetup)
            setIsSaved(true);
    }

    const errorStyle = () => {
        var style = [];
        style.push(Style.textDanger);
        if (props.mobile)
          style.push(Style.errorText);        
        return style;
    }

    const errorContainerStyle = () => {
        var style = [];
        if (props.mobile) {
            style.push(Style.errorMsgMobile);
        }
        else {
            style.push(Style.errorMsg);
        }
        return style;
    }

    const containerStyle = () => {
        var padding = 20;
        var borderRadius = Radius.large;
        var borderColor = Color.border;
        var borderWidth = 1;
        var marginTop = 10;
        if (props.mobile) {
            padding = 0;
            borderRadius = 0;
            borderWidth = 0;
            marginTop = 0
        }

        return {
            padding: padding,
            borderRadius: borderRadius,
            borderColor: borderColor,
            borderWidth: borderWidth,
            marginTop: marginTop
        }
    }

    const title = () => {
        return !props.isSetup ? "Setup your profile" : "Profile settings";
    }

    const subtitle = () => {
        return !props.isSetup ? "Tell us about yourself" : "Update your information";
    }

    const subTitleStyle = () => {
        var style = [];
        style.push(_styles.subtitle);
        if (props.mobile) {
            style.push(_styles.subTitleMobile);
        }
        
        return style;
    }

    const checkSubmitDisabled = () => {
        return isSaved || !bioForm || tagForm.length != 5
    }

    const completeSave = (loc :string) => {
        setIsLoading(false);
        setIsSaved(true);
        if (!props.isSetup) {
            if (loc == 'back') {
                navigation.navigate(NavTo.Account, {view: 'info'} as never);
                props.setView(AccountScreenType.info);
            }
            else {
                navigation.navigate(NavTo.Account, {view: 'survey'} as never);
                props.setView(AccountScreenType.survey);
            }
        }
        else if (loc == 'info') {
            props.setView(AccountScreenType.info)
        }
    }

    const onSave = async (loc: string = '') => {
        if (!checkSubmitDisabled()) {
            setError('');
            setIsLoading(true);
            let hasError = false;
            let setup_step = props.isSetup ? '' : 'survey';
            let obj = {bio:bioForm, tags:tagForm, setup_step:setup_step};
            let js = JSON.stringify(obj);

            try
            {   
                let tokenHeader = await authTokenHeader();
                await fetch(`${env.URL}/users/setupProfile`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                    let res = JSON.parse(await ret.text());
                    if (res.Error)
                    {
                        if (res.Error == "Un-Authorized") {
                            await props.unauthorized();
                            return;
                        }
                        hasError = true;
                    }
                    else {
                        completeSave(loc);
                    }
                });
            }
            catch(e)
            {
                hasError = true;
            } 
            if (hasError) {
                setIsSaved(false);
                setError('A problem occurred while saving account information, please try again.');
            }

            setIsLoading(false);
        }
        else
            completeSave(loc);
    }

    const setBio = (e: any) => {
        setIsSaved(false);
        setBioForm(e)
    }

    const onLoad = async () => {
        setError('');
        let hasError = false;
        try
        {   
            let tokenHeader = await authTokenHeader();
            await fetch(`${env.URL}/users/getBioAndTags`,
            {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}).then(async ret => {
                let res = JSON.parse(await ret.text());
                if (res.Error)
                {
                    if (res.Error == "Un-Authorized") {
                        await props.unauthorized();
                        return;
                    }
                    hasError = true;
                }
                else {
                    setIsComplete(true);
                    setupPage(res);
                }
            });
        }
        catch(e)
        {
            hasError = true;
        } 
        if (hasError) 
            setError('A problem occurred while retrieving account information, please reload the page and try again.');
    
        setIsLoaded(true);
    }

    const submitText = () => {
        if (isSaved) {
            return !props.isSetup ? 'No Changes' : 'Changes Saved';
        }
        else {
            return !props.isSetup ? 'Next' : 'Save';
        }
    }

    return (
    <View>
        <ScrollView>
            <View>
                <View
                style={_styles.titleContainer}
                >
                    <_Text
                    style={_styles.title}
                    >
                        {title()}
                    </_Text>
                    {props.isSetup ?
                    <_Button
                    style={Style.buttonInverted}
                    textStyle={Style.buttonInvertedText}
                    onPress={(e: any) => onSave('info')}
                    >
                        Edit Account
                    </_Button>
                    : null }
                </View>
            </View>
            <View
            style={[containerStyle(), _styles.container]}
            >
                <_Text
                style={subTitleStyle()}
                >
                    {subtitle()}
                </_Text>
                <_TextInput
                multiline={true}
                height={250}
                label="Bio"
                required={true}
                containerStyle={_styles.formGap}
                showMaxLength={true}
                maxLength={1000}
                onChangeText={(e: any) => setBio(e)}
                value={bioForm}
                >

                </_TextInput>
                <_Cluster
                label="Activities and Interests"
                required={true}
                minAmount={5}
                amount={tagsAmount}
                setAmount={setTagsAmount}
                options={tags}
                containerStyle={_styles.formGap}
                selected={tagForm}
                select={setTagForm}
                updated={setIsSaved}
                >
                </_Cluster>
                <View
                style={_styles.options}
                >
                    {!props.isSetup ?
                    <Pressable
                    style={_styles.arrowContainer}
                    onPress={(e: any) => onSave('back')}
                    >
                        <FontAwesomeIcon 
                        size={20} 
                        color={Color.textSecondary} 
                        style={_styles.backArrow} 
                        icon="arrow-left"
                        >
                        </FontAwesomeIcon>
                        <_Text
                        style={Style.textDefaultSecondary}
                        >
                            Go Back
                        </_Text>
                    </Pressable>
                    :
                    <View>
                    </View>
                    }
                    <View
                    style={_styles.buttonContainer}
                    >
                        <_Button
                        loading={isLoading}
                        style={Style.buttonGold}
                        disabled={checkSubmitDisabled()}
                        onPress={(e: any) => onSave('next')}
                        >
                            {submitText()}
                        </_Button>
                    </View>
                </View>
                {error || props.error ?
                <_Text
                containerStyle={errorContainerStyle()}
                innerContainerStyle={{justifyContent: 'center'}}
                style={errorStyle()}
                >
                    {error}
                </_Text>
                : null}
                {!isLoaded ?
                <View
                style={Style.maskPrompt}
                >
                    <ActivityIndicator
                    size="large"
                    color={Color.gold}
                    style={Style.maskLoading}
                    />    
                </View>
                : null }
            </View>
        </ScrollView>
    </View>
    );
};

const _styles = StyleSheet.create({
    formGap: {
        marginBottom: 20
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 20
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        backgroundColor: Color.white,
    },
    title: {
        fontFamily: 'Inter-SemiBold',
        fontSize: FontSize.large
    },
    subtitle: {
        color: Color.textTertiary,
        paddingBottom: 20,
        fontSize: FontSize.large
    },
    subTitleMobile: {
        fontSize: FontSize.default
    },
    arrowContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    backArrow: {
        marginRight: 5,
        ...Platform.select({
            web: {
                outlineStyle: 'none'
            }
        })
    },
    options: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 'auto',
        alignItems: 'center',
        width: '100%',
    },
});

export default AccountAbout;