import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import _TextInput from '../control/text-input';
import _Dropdown from '../control/dropdown';
import _Checkbox from '../control/checkbox';
import _Group from '../control/group';
import _Text from '../control/text';
import React, { useState } from 'react';
import { Color, FontSize, Radius, Style } from '../../style';
import { styles } from '../../screens/login';

const AccountInfo = (props: any, {navigation}:any) => {
    const [message,setMessage] = useState('this is an error message');
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
        // JA TODO Switch text based on account setup or not
        return "Setup your profile";
    }

    const subtitle = () => {
        // JA TODO Switch text based on account setup or not
        return "We need some basic information";
    }

    const subTitleStyle = () => {
        var style = [];
        style.push(_styles.subtitle);
        if (props.mobile) {
            style.push(_styles.subTitleMobile);
        }
        
        return style;
    }

    return (
    <ScrollView>
        <View>
            <_Text
            style={_styles.title}
            >
                {title()}
            </_Text>
        </View>
        <View
        style={[containerStyle(), _styles.container]}
        >
            <_Text
            style={subTitleStyle()}
            >
                {subtitle()}
            </_Text>
            <View>

            </View>
            <_TextInput
            label="First Name"
            required={true}
            containerStyle={_styles.formGap}
            ></_TextInput>
            <_TextInput
            label="Last Name"
            required={true}
            containerStyle={_styles.formGap}
            ></_TextInput>
            <_Group
            required={true}
            style={_styles.formGap}
            mobile={props.mobile}
            label="Birthday"
            >
                <_Dropdown
                label="Month"
                options={
                    [{key:1, value:'TestSelect'},{key:2, value:'Another'},{key:2, value:'Select'},{key:3, value:'Testing'},{key:4, value:'LookHere'},{key:5, value:'What is this?'},{key:6, value:'Some Option'},{key:7, value:'No Thank you'},{key:8, value:'Another Test'},{key:9, value:'LookHere'},{key:1, value:'TestSelect'},{key:2, value:'Another'},{key:2, value:'Select'},{key:3, value:'Testing'},{key:4, value:'LookHere'},{key:5, value:'What is this?'},{key:6, value:'Some Option'},{key:7, value:'No Thank you'},{key:8, value:'Another Test'},{key:9, value:'LookHere'},{key:1, value:'TestSelect'},{key:2, value:'Another'},{key:2, value:'Select'},{key:3, value:'Testing'},{key:4, value:'LookHere'},{key:5, value:'What is this?'},{key:6, value:'Some Option'},{key:7, value:'No Thank you'},{key:8, value:'Another Test'},{key:9, value:'LookHere'}]
                }
                ></_Dropdown>
                <_Dropdown
                label="Day"
                ></_Dropdown>
                <_Dropdown
                label="Year"
                ></_Dropdown>
            </_Group>
            <_Group
            mobile={props.mobile}
            style={_styles.formGap}
            noBackground={true}
            >
                <_TextInput
                label="Phone Number"
                required={true}
                ></_TextInput>
                <_Checkbox
                label="Public Phone Number"
                />
            </_Group>
            <_Group
            label="Location"
            mobile={props.mobile}
            required={true}
            style={_styles.formGap}
            >
                <_TextInput
                label="Zip Code"
                ></_TextInput>
                <_TextInput
                label="City"
                ></_TextInput>
                <_Dropdown
                label="State"
                ></_Dropdown>
            </_Group>
            <_Dropdown
            label="Gender"
            ></_Dropdown>
            <_Text
            style={Style.textSmallDanger}
            >{message}</_Text>
        </View>
    </ScrollView>
    );
};

const _styles = StyleSheet.create({
    error: {

    },
    group: {
        backgroundColor: Color.default
    },
    groupFocus: {
        zIndex: 1,
        elevation: 1
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
    formGap: {
        marginBottom: 15
    },
    checkbox: {
        ...Platform.select({
            android: {
                backgroundColor: Color.black
            }
        }),
    }
});

export default AccountInfo;